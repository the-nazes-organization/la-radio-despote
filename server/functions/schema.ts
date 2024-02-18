import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema(
	{
		rooms: defineTable({
			name: v.string(),
			listeners: v.array(v.id('users')),
		}),

		tracks: defineTable({
			// todo remove optional here
			askedBy: v.optional(v.id('users')),
			askedAt: v.number(),
			playedAt: v.optional(v.number()),
			duration: v.number(),
			room: v.id('rooms'),
			spotifyTrackDataId: v.id('spotifyTrackData'),
		}).index('by_played_at', ['playedAt']),

		spotifyTrackData: defineTable({
			duration: v.number(),
			name: v.string(),
			spotifyId: v.string(),
			artists: v.array(
				v.object({
					id: v.string(),
					name: v.string(),
				}),
			),
			album: v.object({
				id: v.string(),
				name: v.string(),
				images: v.array(
					v.object({
						url: v.string(),
						height: v.number(),
						width: v.number(),
					}),
				),
			}),
			previewUrl: v.optional(v.string()),
		}).index('by_spotify_id', ['spotifyId']),

		users: defineTable({
			username: v.string(),
			email: v.string(),
			password: v.string(),
		}),
	},
	{
		schemaValidation: false,
	},
);
