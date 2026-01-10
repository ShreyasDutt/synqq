import { v } from "convex/values";
import { mutation, query, MutationCtx } from "./_generated/server";

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
  });

  await ctx.db.insert("participant", {
    roomId,
    role: "admin",
    joinedAt: Date.now(),
    displayName,
    country: country || "IN",
    region: region || "XY",
    city: city || "Chandigarh",
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
  handler: async (ctx, { roomCode, displayName, country, region, city}) => {
    if (!roomCode) {
      const roomCode = await generateRandomRoomCode(ctx);
      await createRoomInternal({ ctx, roomCode, displayName, country, region, city});
      return roomCode;
    }

    console.log("From JoinRoom Mutation : ",country,region,city)

    const room = await ctx.db
      .query("room")
      .withIndex("byRoomCode", (q) => q.eq("roomCode", roomCode))
      .unique();

    if (!room) {
      await createRoomInternal({ ctx, roomCode, displayName, country, region, city});
      return;
    }

    const participant = await ctx.db
      .query("participant")
      .withIndex("byDisplayNameAndRoomId", (q) =>
        q.eq("displayName", displayName).eq("roomId", room._id)
      )
      .unique();

    if (participant) return;
      
    // For Dev env only will be removed when deployed
    const TestCountry = 'CA'
    const TestRegion = 'ON'
    const TestCity = 'Toronto'

      if (country&& region && city) {
      await ctx.db.insert("participant", {
      displayName,
      joinedAt: Date.now(),
      role: "user",
      roomId: room._id,
      country: country,
      region: region,
      city: city,
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
    });
    }

      

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

    const participant = await ctx.db
      .query("participant")
      .withIndex("byDisplayNameAndRoomId", (q) =>
        q.eq("displayName", displayName).eq("roomId", room._id)
      )
      .unique();
    if (!participant)
      return console.error("Participant not found while leaving room");

    const isAdmin = participant.role === "admin";
    await ctx.db.delete(participant._id);

    const otherParticipants = await ctx.db
      .query("participant")
      .withIndex("byRoomId", (q) => q.eq("roomId", room._id))
      .collect();

    if (otherParticipants.length === 0) {
      await ctx.db.delete(room._id);
      return;
    }

    if (isAdmin) {
      const newAdmin = otherParticipants[0];
      await ctx.db.patch(newAdmin._id, { role: "admin" });
    }
  },
});


//----queries----
export const getRooms = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("room").collect();
  },
});

export const getRoomData = query({
  args: {
    roomCode: v.number()
  },
  handler: async (ctx, { roomCode }) => {
    const room = await ctx.db.query("room").withIndex('byRoomCode', (q => q.eq("roomCode", roomCode))).unique();
    
    if (!room) return console.error("Error while getting room in the getRoomParticipants query")
    
    const participants = await ctx.db.query("participant").withIndex("byRoomId", (q => q.eq("roomId", room._id))).collect();
    return { room, participants };
  }
})

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
