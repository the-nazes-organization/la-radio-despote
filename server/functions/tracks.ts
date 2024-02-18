import { v } from 'convex/values';
import { internalMutation, mutation } from './_generated/server';

export const addTrack = mutation({
	args: {
		asked_by: v.id('users'),
		duration: v.number(),
		room: v.id('rooms'),
		spotifyId: v.string(),
	},
	handler: async (ctx, args) => {
		return ctx.db.insert('tracks', {
			asked_by: args.asked_by,
			duration: args.duration,
			room: args.room,
			spotifyId: args.spotifyId,
		});
	},
});

export const deleteAllTracks = internalMutation(async ctx => {
	const tracks = await ctx.db.query('tracks').collect();
	await Promise.all(tracks.map(track => ctx.db.delete(track._id)));
});
