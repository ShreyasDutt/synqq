import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  participant: defineTable({
    displayName: v.string(),
    country: v.string(),
    region: v.string(),
    city: v.string(),
    roomId: v.id('room'),
    role: v.string(), //admin or user
    joinedAt: v.number(),
    lastSeen: v.number(),
  })
    .index("byDisplayName", ["displayName"])
    .index("byRoomId", ["roomId"])
    .index("byDisplayNameAndRoomId", ["displayName", "roomId"]),

  room: defineTable({
    roomCode: v.number(),
    createdAt: v.number(),
    songsQueue: v.optional(v.array(v.string())),
    currentSong: v.optional(v.string()),
    currentSongState: v.boolean(), //default set to false
    currentLoopState: v.string(), //album or song or none
    currentSongProgress: v.number(),
    playbackPermissions: v.string(), //admins or everyone
    globalVolume: v.number(), //1 to 100
    updatedAt: v.optional(v.number()), //timestamp of last update to the room/song state
  }).index("byRoomCode", ["roomCode"]),

  message: defineTable({
    roomId: v.id('room'),
    sendBy: v.string(), //displayName of the user
    createdAt: v.number(),
    content: v.string(),
  }).index("byRoomId", ["roomId"]),

  song: defineTable({
    roomId: v.id('room'),
    title: v.string(),
    duration: v.number(),
    storageId: v.id('_storage')
  }).index("byRoomId", ["roomId"]),
});