import { v } from 'convex/values';
import { internalMutation, mutation, query } from './_generated/server';

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

export const getRoomTracks = query({
	args: { roomId: v.id('rooms') },
	handler: async (ctx, args) => {
		const tracks = ctx.db
			.query('tracks')
			.filter(q => q.eq(q.field('room'), args.roomId));
		return tracks;
	},
});

export const addRoom = mutation({
	args: { name: v.string() },
	handler: async (ctx, args) => {
		return ctx.db.insert('rooms', {
			name: args.name,
			listeners: [],
		});
	},
});

export const deleteAllRooms = internalMutation(async ctx => {
	const rooms = await ctx.db.query('rooms').collect();
	await Promise.all(rooms.map(room => ctx.db.delete(room._id)));
});
