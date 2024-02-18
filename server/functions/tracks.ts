import { v } from 'convex/values';
import { internalMutation, mutation } from './_generated/server';

export const addTrack = mutation({
	args: {
		askedBy: v.id('users'),
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

export const deleteAllTracks = internalMutation(async ctx => {
	const tracks = await ctx.db.query('tracks').collect();
	await Promise.all(tracks.map(track => ctx.db.delete(track._id)));
});
