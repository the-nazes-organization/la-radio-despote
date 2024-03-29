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
			listeners: v.array(spotifyUserProfileSchema),
			recommendations: v.array(v.id('spotifyTrackData')),
		}),

		tracks: defineTable({
			askedBy: v.union(v.id('users'), v.null()),
			askedAt: v.number(),
			playedAt: v.optional(v.number()),
			duration: v.number(),
			room: v.id('rooms'),
			spotifyTrackDataId: v.id('spotifyTrackData'),
			scheduledFunctionId: v.optional(v.id('_scheduled_functions')),
		})
			.index('by_room_played_at', ['room', 'playedAt'])
			.index('by_room_played_at_asked_at', ['room', 'playedAt', 'askedAt'])
			.index('by_played_at', ['playedAt'])
			.index('by_asked_by', ['askedBy']),

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

		reactions: defineTable({
			askedBy: v.union(v.id('users'), v.null()),
			roomId: v.id('rooms'),
			userId: v.id('users'),
			spotifyId: v.string(),
			type: v.union(v.literal('like'), v.literal('dislike')),
		})
			.index('by_room', ['roomId'])
			.index('by_user', ['userId'])
			.index('by_track', ['spotifyId'])
			.index('by_user_by_likes', ['userId', 'type'])
			.index('by_author_by_likes', ['askedBy', 'type'])
			.index('by_user_by_likes_by_track', ['userId', 'type', 'spotifyId']),
	},

	{ schemaValidation: false },
);
