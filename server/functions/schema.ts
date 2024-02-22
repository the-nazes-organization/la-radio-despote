import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema(
	{
		rooms: defineTable({
			name: v.string(),
			listeners: v.array(v.id('users')),
			recommendations: v.array(v.id('spotifyTrackData')),
		}),

		tracks: defineTable({
			// todo remove optional here
			askedBy: v.optional(v.id('users')),
			askedAt: v.number(),
			playedAt: v.optional(v.number()),
			duration: v.number(),
			room: v.id('rooms'),
			spotifyTrackDataId: v.id('spotifyTrackData'),
		})
			.index('by_room_played_at', ['room', 'playedAt'])
			.index('by_room_played_at_asked_at', ['room', 'playedAt', 'askedAt'])
			.index('by_played_at', ['playedAt']),

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
			spotifyUserProfile: v.object({
				country: v.string(),
				display_name: v.string(),
				email: v.string(),
				explicit_content: v.object({
					filter_enabled: v.boolean(),
					filter_locked: v.boolean(),
				}),
				external_urls: v.object({ spotify: v.string() }),
				followers: v.object({
					href: v.null(),
					total: v.float64(),
				}),
				href: v.string(),
				id: v.string(),
				images: v.array(
					v.object({
						height: v.float64(),
						url: v.string(),
						width: v.float64(),
					}),
				),
				product: v.string(),
				type: v.string(),
				uri: v.string(),
			}),
		}),
	},

	{ schemaValidation: false },
);
