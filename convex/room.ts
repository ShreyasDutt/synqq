import { v } from "convex/values";
import {
  mutation,
  query,
  MutationCtx,
  internalMutation,
} from "./_generated/server";

type createRoomInternal = {
  ctx: MutationCtx;
  roomCode: number;
  displayName: string;
  country?: string;
  region?: string;
  city?: string;
};

const generateRandomRoomCode = async (ctx: MutationCtx) => {
  for (let i = 0; i < 10; i++) {
    // try 10 times max
    const randomRoomCode = Math.floor(100000 + Math.random() * 900000);
    const existingRoom = await ctx.db
      .query("room")
      .withIndex("byRoomCode", (q) => q.eq("roomCode", randomRoomCode))
      .unique();
    if (!existingRoom) return randomRoomCode;
  }
  throw new Error("Could not generate unique 6-digit room code after 10 tries");
};

const createRoomInternal = async ({
  ctx,
  roomCode,
  displayName,
  country,
  region,
  city,
}: createRoomInternal) => {
  const roomId = await ctx.db.insert("room", {
    roomCode,
    createdAt: Date.now(),
    currentSongState: false,
    currentLoopState: "none",
    currentSongProgress: 0.0,
    playbackPermissions: "admins",
    globalVolume: 75,
  });

  await ctx.db.insert("participant", {
    roomId,
    role: "admin",
    joinedAt: Date.now(),
    displayName,
    country: country || "IN",
    region: region || "BC",
    city: city || "Vancouver",
    lastSeen: Date.now(),
  });
};

//-----mutations----
export const joinRoom = mutation({
  args: {
    displayName: v.string(),
    roomCode: v.optional(v.number()),
    country: v.optional(v.string()),
    region: v.optional(v.string()),
    city: v.optional(v.string()),
  },
  handler: async (ctx, { roomCode, displayName, country, region, city }) => {
    if (!roomCode) {
      const roomCode = await generateRandomRoomCode(ctx);
      await createRoomInternal({
        ctx,
        roomCode,
        displayName,
        country,
        region,
        city,
      });
      return roomCode;
    }

    const room = await ctx.db
      .query("room")
      .withIndex("byRoomCode", (q) => q.eq("roomCode", roomCode))
      .unique();

    if (!room) {
      await createRoomInternal({
        ctx,
        roomCode,
        displayName,
        country,
        region,
        city,
      });
      return;
    }

    const participant = await ctx.db
      .query("participant")
      .withIndex("byDisplayNameAndRoomId", (q) =>
        q.eq("displayName", displayName).eq("roomId", room._id),
      )
      .unique();

    if (participant) return;

    // For Dev env only will be removed when deployed
    const TestCountry = "IN";
    const TestRegion = "ON";
    const TestCity = "Toronto";

    if (country && region && city) {
      await ctx.db.insert("participant", {
        displayName,
        joinedAt: Date.now(),
        role: "user",
        roomId: room._id,
        country: country,
        region: region,
        city: city,
        lastSeen: Date.now(),
      });
    }

    // For Dev env only will be removed when deployed
    else {
      await ctx.db.insert("participant", {
        displayName,
        joinedAt: Date.now(),
        role: "user",
        roomId: room._id,
        country: TestCountry,
        region: TestRegion,
        city: TestCity,
        lastSeen: Date.now(),
      });
    }
  },
});

export const everyonePermission = mutation({
  args: {
    roomCode: v.number(),
  },
  handler: async (ctx, { roomCode }) => {
    const room = await ctx.db
      .query("room")
      .withIndex("byRoomCode", (q) => q.eq("roomCode", roomCode))
      .unique();
    if (!room) {
      console.error("Room not found!!");
      return { success: false };
    }
    await ctx.db.patch(room._id, { playbackPermissions: "everyone" });
    return { success: true };
  },
});

export const adminsPermission = mutation({
  args: {
    roomCode: v.number(),
  },
  handler: async (ctx, { roomCode }) => {
    const room = await ctx.db
      .query("room")
      .withIndex("byRoomCode", (q) => q.eq("roomCode", roomCode))
      .unique();
    if (!room) {
      console.error("Room not found!!");
      return { success: false };
    }
    await ctx.db.patch(room._id, { playbackPermissions: "admins" });
    return { success: true };
  },
});

export const UpdateLastSeen = mutation({
  args: {
    displayName: v.string(),
    roomCode: v.number(),
  },
  handler: async (ctx, { displayName, roomCode }) => {
    const room = await ctx.db
      .query("room")
      .withIndex("byRoomCode", (q) => q.eq("roomCode", roomCode))
      .unique();
    if (!room) return console.error("Room not found while updating last seen");

    const participant = await ctx.db
      .query("participant")
      .withIndex("byDisplayNameAndRoomId", (q) =>
        q.eq("displayName", displayName).eq("roomId", room._id),
      )
      .unique();

    if (!participant)
      return console.error("Participant not found while updating last seen");

    await ctx.db.patch(participant._id, { lastSeen: Date.now() });
  },
});

export const changeVolume = mutation({
  args: {
    roomCode: v.number(),
    globalVolume: v.number(),
  },
  handler: async (ctx, { roomCode, globalVolume }) => {
    const room = await ctx.db
      .query("room")
      .withIndex("byRoomCode", (q) => q.eq("roomCode", roomCode))
      .unique();
    if (!room) return console.error("Room not found!!");
    await ctx.db.patch(room._id, { globalVolume });
  },
});

export const makeAdmin = mutation({
  args: {
    participantId: v.id("participant"),
  },
  handler: async (ctx, { participantId }) => {
    await ctx.db.patch(participantId, {
      role: "admin",
    });
  },
});

export const deleteInactiveParticipants = internalMutation({
  handler: async (ctx) => {
    const cutoff = Date.now() - 60_000;

    const staleParticipants = await ctx.db
      .query("participant")
      .filter((q) => q.lt(q.field("lastSeen"), cutoff))
      .collect();

    const affectedRoomIds = new Set(staleParticipants.map((p) => p.roomId));

    for (const p of staleParticipants) {
      await ctx.db.delete(p._id);

      for (const roomId of affectedRoomIds) {
        const participant = await ctx.db
          .query("participant")
          .withIndex("byRoomId", (q) => q.eq("roomId", roomId))
          .first();
        if (!participant) {
          const messages = await ctx.db
            .query("message")
            .withIndex("byRoomId", (q) => q.eq("roomId", roomId))
            .collect();

          for (const message of messages) {
            await ctx.db.delete(message._id);
          }
          const songs = await ctx.db
            .query("song")
            .withIndex("byRoomId", (q) => q.eq("roomId", roomId))
            .collect();
          for (const song of songs) {
            await ctx.storage.delete(song.storageId);
            await ctx.db.delete(song._id);
          }
          await ctx.db.delete(roomId);
          return;
        } else {
          const leftParticipants = await ctx.db
            .query("participant")
            .withIndex("byRoomId", (q) => q.eq("roomId", roomId))
            .collect();

          const adminParticipants = leftParticipants.filter(
            (p) => p.role === "admin",
          );
          if (adminParticipants.length === 0) {
            await ctx.db.patch(leftParticipants[0]._id, {
              role: "admin",
            });
          }
        }
      }
    }
  },
});

export const removeAdmin = mutation({
  args: {
    participantId: v.id("participant"),
  },
  handler: async (ctx, { participantId }) => {
    await ctx.db.patch(participantId, {
      role: "user",
    });
  },
});

//----queries----

export const getRoomData = query({
  args: {
    roomCode: v.number(),
  },
  handler: async (ctx, { roomCode }) => {
    const room = await ctx.db
      .query("room")
      .withIndex("byRoomCode", (q) => q.eq("roomCode", roomCode))
      .unique();

    if (!room)
      return console.error(
        "Error while getting room in the getRoomParticipants query",
      );

    const participants = await ctx.db
      .query("participant")
      .withIndex("byRoomId", (q) => q.eq("roomId", room._id))
      .collect();
    return { room, participants };
  },
});

export const activeParticipants = query({
  handler: async (ctx) => {
    const participants = await ctx.db.query("participant").collect();
    return participants.length;
  },
}); 

// get both room and users

export const getRoomFullData = query({
  args: {},
  handler: async (ctx) => {
    const rooms = await ctx.db.query("room").collect();
    if (rooms.length === 0) return [];

    const participants = await ctx.db.query("participant").collect();

    const participantsByRoomId = new Map<string, typeof participants>();

    for (const p of participants) {
      const list = participantsByRoomId.get(p.roomId) ?? [];
      list.push(p);
      participantsByRoomId.set(p.roomId, list);
    }

    return rooms.map((room) => ({
      room,
      participants: participantsByRoomId.get(room._id) ?? [],
    }));
  },
});





