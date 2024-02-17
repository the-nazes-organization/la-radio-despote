import { v } from 'convex/values';
import { query } from './_generated/server';

export const getRooms = query({
	args: {},
	handler: async ctx => {
		return ctx.db.query('rooms').take(100);
	},
});

export const getRoomById = query({
	args: { roomId: v.id('rooms') },
	handler: async (ctx, args) => {
		const [room, tracks] = await Promise.all([
			await ctx.db.get(args.roomId),
			await ctx.db
				.query('tracks')
				.filter(q => q.eq(q.field('room'), args.roomId))
				.take(100),
		]);

		return {
			room,
			tracks,
		};
	},
});

export const getRoomTracks = query({
	args: { roomId: v.id('rooms') },
	handler: async (ctx, args) => {
		const tracks = ctx.db
			.query('tracks')
			.filter(q => q.eq(q.field('room'), args.roomId));
		return tracks;
	},
});
