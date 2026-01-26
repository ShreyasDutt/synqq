import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const uploadSong = mutation({
  args: {
    storageId: v.id("_storage"),
    roomCode: v.number(),
    title: v.string(),
    duration: v.number(),
  },
  handler: async (ctx, { storageId, roomCode, title, duration }) => {
    const room = await ctx.db
      .query("room")
      .withIndex("byRoomCode", (q) => q.eq("roomCode", roomCode))
      .unique();
    if (!room) return console.error("Room not found!!");
    await ctx.db.insert("song", {
      roomId: room._id,
      storageId,
      title,
      duration,
    });

    return { success: true };
  },
});

export const deleteSong = mutation({
  args: {
    songId: v.id("song"),
  },
  handler: async (ctx, { songId }) => {
    const song = await ctx.db
      .query("song")
      .withIndex("by_id", (q) => q.eq("_id", songId))
      .unique();
    if (!song) return console.error("Song not found!!");

    await ctx.storage.delete(song.storageId);

    await ctx.db.delete(songId);

    return { success: true };
  },
});

export const getSongs = query({
  args: {
    roomCode: v.number(),
  },
  handler: async (ctx, { roomCode }) => {
    const room = await ctx.db
      .query("room")
      .withIndex("byRoomCode", (q) => q.eq("roomCode", roomCode))
      .unique();
    if (!room) return console.error("Room not found!!");

    return await ctx.db
      .query("song")
      .withIndex("byRoomId", (q) => q.eq("roomId", room._id))
      .collect();
  },
});

export const getSongUrl = query({
  args: {
    songId: v.id("song"),
  },
  handler: async (ctx, { songId }) => {
    const song = await ctx.db
      .query("song")
      .withIndex("by_id", (q) => q.eq("_id", songId))
      .unique();
    if (!song) return console.error("Song not found!!");

    return await ctx.storage.getUrl(song.storageId);
  },
});


export const setRoomSongUrl = mutation({
  args:{
    roomCode: v.number(),
    songUrl: v.string(),
  },
  handler: async(ctx, {roomCode, songUrl})=>{
    const room = await ctx.db
      .query("room")
      .withIndex("byRoomCode", (q) => q.eq("roomCode", roomCode))
      .unique();
    if (!room) return console.error("Room not found!!");
    await ctx.db.patch(room._id, { currentSong: songUrl,currentSongState: true });
    return { success: true }; 
  }
})

export const FlipSongPlayState = mutation({
  args:{
    roomCode: v.number(),
    currentSongTime: v.number(),
    isPlaying: v.boolean(),
  },
  handler: async(ctx, {roomCode, currentSongTime, isPlaying})=>{
    console.log("Current Song Time Backend : ",currentSongTime)
    const room = await ctx.db
      .query("room")
      .withIndex("byRoomCode", (q) => q.eq("roomCode", roomCode))
      .unique();
    if (!room) return console.error("Room not found!!");
    await ctx.db.patch(room._id, { currentSongProgress: currentSongTime, updatedAt: Date.now(), currentSongState: isPlaying });
    return { success: true }; 
  }
})

export const changeSongState = mutation({
  args:{
    roomCode: v.number()
  },
  handler: async(ctx, {roomCode})=>{
    const room = await ctx.db
      .query("room")
      .withIndex("byRoomCode", (q) => q.eq("roomCode", roomCode))
      .unique();
    if (!room) return console.error("Room not found!!");
    await ctx.db.patch(room._id, { currentSongState: !room.currentSongState });
    return { success: true }; 
  }
})