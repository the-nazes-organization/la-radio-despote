import { v } from 'convex/values';
import { query } from './_generated/server';

export const getRooms = query({
	args: {},
	handler: async ctx => {
		return await ctx.db.query('rooms').collect();
	},
});

export const getRoomById = query({
	args: { roomId: v.id('rooms') },
	handler: async (ctx, args) => {
		const room = await ctx.db
			.query('rooms')
			.filter(q => q.eq(q.field('_id'), args.roomId))
		return room;
	},
});

export const getRoomTracks = query({
	args: { roomId: v.id('rooms') },
	handler: async (ctx, args) => {
		const tracks = await ctx.db
			.query('tracks')
			.filter(q => q.eq(q.field('room'), args.roomId));
		return tracks;
	},
});
