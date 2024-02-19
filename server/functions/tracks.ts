import { v } from 'convex/values';
import { internalMutation, mutation } from './_generated/server';

/**
 * Adds a track to the queue of a room.
 */
export const addTrackToQueue = internalMutation({
	args: {
		askedBy: v.optional(v.id('users')),
		duration: v.number(),
		playedAt: v.optional(v.number()),
		askedAt: v.number(),
		room: v.id('rooms'),
		spotifyTrackDataId: v.id('spotifyTrackData'),
	},
	handler: async (ctx, args) => {
		return ctx.db.insert('tracks', {
			askedBy: args.askedBy,
			askedAt: args.askedAt,
			duration: args.duration,
			room: args.room,
			spotifyTrackDataId: args.spotifyTrackDataId,
			playedAt: args.playedAt,
		});
	},
});

/**
 * Stores the spotify track data for a track.
 */
export const saveSpotifyTrackData = internalMutation({
	args: {
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
	},

	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query('spotifyTrackData')
			.withIndex('by_spotify_id', q => q.eq('spotifyId', args.spotifyId))
			.unique();

		return existing
			? ctx.db.patch(existing._id, args).then(() => existing._id)
			: ctx.db.insert('spotifyTrackData', args);
	},
});

/**
 * Deletes a track from the queue of a room.
 */
export const removeTrack = mutation({
	args: {
		trackId: v.id('tracks'),
	},
	handler: async (ctx, args) => {
		return ctx.db.delete(args.trackId);
	},
});
