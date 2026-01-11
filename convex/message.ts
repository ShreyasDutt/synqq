import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sendMessage = mutation({
  args: {
    roomCode: v.number(),
    message: v.string(),
    displayName: v.string(),
  },
  handler: async (ctx, { roomCode, message, displayName }) => {
    const room = await ctx.db
      .query("room")
      .withIndex("byRoomCode", (q) => q.eq("roomCode", roomCode))
      .unique();
    if (!room) {
      console.error(
        `Room not found while sending message for roomCode: ${roomCode}`
      );
      return { success: false };
    }
    await ctx.db.insert("message", {
      roomId: room._id,
      sendBy: displayName,
      createdAt: Date.now(),
    });
    return { success: true };
  },
});

export const getMessages = query({
  args: {
    roomCode: v.number(),
  },
  handler: async (ctx, { roomCode }) => {
    const room = await ctx.db
      .query("room")
      .withIndex("byRoomCode", (q) => q.eq("roomCode", roomCode))
      .unique();
    if (!room) {
      console.error(
        `Room not found while getting messages for roomCode: ${roomCode}`
      );
      return { success: false };
    }

    const messages = await ctx.db
      .query("message")
      .withIndex("byRoomId")
      .collect();
    if (!messages) {
      console.error(`Messages not found for roomCode: ${roomCode}`);
      return { success: false };
    }
    return { messages, success: true };
  },
});
