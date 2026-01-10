import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  participant: defineTable({
    displayName: v.string(),
    country:v.string(),
    region:v.string(),
    city:v.string(),
    roomId: v.string(),
    role: v.string(), //Admin or User
    joinedAt: v.number()
  }).index("byDisplayName", ["displayName"]). index("byRoomId", ["roomId"]). index("byDisplayNameAndRoomId", ["displayName","roomId"]),

  room: defineTable({
    roomCode: v.number(),
    createdAt: v.number(),
    songsQueue: v.optional(v.array(v.string())),
    currentSong: v.optional(v.string()),
    currentSongState: v.boolean(), //default set to false
    currentLoopState: v.string(), //album or song or none
    currentSongProgress: v.number(),
  }).index("byRoomCode", ["roomCode"]),
});