import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const spotifyUserProfileSchema = v.object({
	country: v.string(),
	display_name: v.string(),
	email: v.string(),
	id: v.string(),
	images: v.array(
		v.object({
			height: v.float64(),
			url: v.string(),
			width: v.float64(),
		}),
	),
});

export default defineSchema(
	{
		sessions: defineTable({
			token: v.string(),
			userId: v.id('users'),
		}).index('by_token', ['token']),

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
			loggedInAt: v.number(),
			spotifyUserProfile: spotifyUserProfileSchema,
		}).index('by_spotify_user_id', ['spotifyUserProfile.id']),
	},

	{ schemaValidation: false },
);
