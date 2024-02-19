import { v } from 'convex/values';
import { query } from './_generated/server';

/**
 * List all rooms.
 */
export const list = query({
	args: {},
	handler: async ctx => {
		const rooms = await ctx.db.query('rooms').take(100);

		return Promise.all(
			rooms.map(async room => {
				const playingTrack = await ctx.db
					.query('tracks')
					.withIndex('by_room_played_at', q => q.eq('room', room._id))
					.order('desc')
					.first();

				const spotifyTrackData = await ctx.db.get(
					playingTrack!.spotifyTrackDataId,
				);

				return {
					...room,
					playing: { ...playingTrack, spotifyTrackData: spotifyTrackData! },
				};
			}),
		);
	},
});

/**
 * Get the detail of a room.
 */
export const get = query({
	args: { roomId: v.id('rooms') },
	handler: async (ctx, args) => {
		const [details, tracks] = await Promise.all([
			ctx.db.get(args.roomId),

			Promise.all(
				await ctx.db
					.query('tracks')

					.withIndex('by_room_played_at', q => q.eq('room', args.roomId))
					.order('asc')

					.collect()
					.then(tracks =>
						tracks.map(async track => {
							const [spotifyTrackData, askedBy] = await Promise.all([
								ctx.db.get(track.spotifyTrackDataId),
								track.askedBy ? ctx.db.get(track.askedBy) : null,
							]);

							return {
								...track,
								spotifyTrackData: spotifyTrackData!,
								askedBy,
							};
						}),
					),
			),
		]);

		const [playing, ...queue] = tracks;

		return {
			details: details!,
			queue,
			playing,
		};
	},
});
