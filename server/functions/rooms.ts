import { v } from 'convex/values';
import { query } from './_generated/server';

/**
 * List all rooms.
 */
export const list = query({
	args: {},
	handler: async ctx => {
		return ctx.db.query('rooms').take(100);
	},
});

/**
 * Get the detail of a room.
 */
export const get = query({
	args: { roomId: v.id('rooms') },
	handler: async (ctx, args) => {
		const [room, tracks] = await Promise.all([
			ctx.db.get(args.roomId),
			Promise.all(
				await ctx.db
					.query('tracks')
					.filter(q => q.eq(q.field('room'), args.roomId))
					.collect()
					.then(tracks =>
						tracks.map(async track => {
							const [spotifyTrackData, askedBy] = await Promise.all([
								ctx.db.get(track.spotifyTrackDataId),
								track.askedBy ? ctx.db.get(track.askedBy) : null,
							]);

							return { ...track, spotifyTrackData, askedBy };
						}),
					),
			),
		]);

		return {
			room,
			tracks,
		};
	},
});
