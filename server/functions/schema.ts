import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	rooms: defineTable({
		_id: v.string(),
		name: v.string(),
		listeners: v.array(v.id("users")),
	}),
	tracks: defineTable({
		_id: v.string(),
		asked_by: v.id("users"),
		duration: v.number(),
		room: v.id("rooms"),
	}),
	users: defineTable({
		_id: v.string(),
		username: v.string(),
		email: v.string(),
		password: v.string(),
	}),
});
