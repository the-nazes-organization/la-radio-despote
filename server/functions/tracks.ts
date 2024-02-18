import { v } from 'convex/values';
import { internalMutation, mutation } from './_generated/server';

export const addTrack = mutation({
	args: {
		asked_by: v.id('users'),
		duration: v.number(),
		played_at: v.optional(v.number()),
		asked_at: v.number(),
		room: v.id('rooms'),
		spotifyId: v.string(),
	},
	handler: async (ctx, args) => {
		return ctx.db.insert('tracks', {
			asked_by: args.asked_by,
			asked_at: args.asked_at,
			duration: args.duration,
			room: args.room,
			spotifyId: args.spotifyId,
			played_at: args.played_at,
		});
	},
});

export const deleteAllTracks = internalMutation(async ctx => {
	const tracks = await ctx.db.query('tracks').collect();
	await Promise.all(tracks.map(track => ctx.db.delete(track._id)));
});
