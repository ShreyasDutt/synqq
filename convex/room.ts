import { v } from "convex/values";
import { mutation, query, MutationCtx } from "./_generated/server";

type createRoomInternal = {
  ctx: MutationCtx;
  roomCode: number;
  displayName: string;
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
}: createRoomInternal) => {
  const roomId = await ctx.db.insert("room", {
    roomCode,
    createdAt: Date.now(),
    currentSongState: false,
    currentLoopState: "none",
    currentSongProgress: 0.0,
  });

  await ctx.db.insert("participant", {
    roomId,
    role: "admin",
    joinedAt: Date.now(),
    displayName,
  });
};

export const getRooms = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("room").collect();
  },
});

export const joinRoom = mutation({
  args: {
    displayName: v.string(),
    roomCode: v.optional(v.number()),
  },
  handler: async (ctx, { roomCode, displayName }) => {
    if (!roomCode) {
      const roomCode = await generateRandomRoomCode(ctx);
      await createRoomInternal({ ctx, roomCode, displayName });
      return roomCode;
    }

    const room = await ctx.db
      .query("room")
      .withIndex("byRoomCode", (q) => q.eq("roomCode", roomCode))
      .unique();

    if (!room) {
      await createRoomInternal({ ctx, roomCode, displayName });
      return;
    }

    const participant = await ctx.db
      .query("participant")
      .withIndex("byDisplayNameAndRoomId", (q) =>
        q.eq("displayName", displayName).eq("roomId", room._id)
      )
      .unique();

    if (participant) return;

    await ctx.db.insert("participant", {
      displayName,
      joinedAt: Date.now(),
      role: "user",
      roomId: room._id,
    });
  },
});


export const leaveRoom = mutation({
  args: {
    roomCode: v.number(),
    displayName: v.string(),
  },
  handler: async (ctx, { roomCode, displayName }) => {
    const room = await ctx.db
      .query("room")
      .withIndex("byRoomCode", (q) => q.eq("roomCode", roomCode))
      .unique();
    if (!room) return console.error("Room not found while leaving room");

    const participant = await ctx.db.query('participant').withIndex("byDisplayNameAndRoomId", (q => q.eq("displayName", displayName).eq("roomId", room._id))).unique();
    if (!participant) return console.error("Participant not found while leaving room");

    const isAdmin = participant.role === "admin";
    await ctx.db.delete(participant._id)

    const otherParticipants = await ctx.db.query("participant").withIndex("byRoomId", (q => q.eq('roomId', room._id))).collect();
    
    if (otherParticipants.length === 0) {
      await ctx.db.delete(room._id);
      return;
    }

    if (isAdmin) {
      const newAdmin = otherParticipants[0];
      await ctx.db.patch(newAdmin._id, {role: "admin"})
    }
  }
})