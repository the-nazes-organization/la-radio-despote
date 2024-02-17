import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  rooms: defineTable({
    _id: v.string(),
    room_id: v.string(),
    room_name: v.string(),
    music_genre: v.string(),
    current_song: v.string(),
    listeners: v.number(),
  }),
});
