import { v } from 'convex/values';
import { internalQuery } from '../../_generated/server';

export const getRoom = internalQuery({
	args: {
		roomId: v.id('rooms'),
	},
	handler: async (ctx, args) => {
		const room = await ctx.db.get(args.roomId);

		if (!room) {
			throw new Error('[ROOM - getRoom]: Room not found');
		}

		return room;
	},
});

export const getFirstRecommendatedTrack = internalQuery({
	args: {
		roomId: v.id('rooms'),
	},
	handler: async (ctx, args) => {
		return ctx.db.get(args.roomId).then(async room => {
			const recommendation = await ctx.db.get(room!.recommendations[0]!);

			if (!recommendation) {
				throw new Error('No recommendations');
			}

			return recommendation;
		});
	},
});

export const getNextTrackInQueue = internalQuery({
	args: {
		roomId: v.id('rooms'),
	},
	handler: async (ctx, args) => {
		const nextTrack = await ctx.db
			.query('tracks')
			.withIndex('by_room_played_at_asked_at', q =>
				q.eq('room', args.roomId).eq('playedAt', undefined),
			)
			.order('asc')
			.first();

		if (!nextTrack) {
			return null;
		}

		const spotifyTrackData = await ctx.db.get(nextTrack.spotifyTrackDataId);

		if (!spotifyTrackData) {
			throw new Error(
				`Could not find spotify track data with id ${nextTrack.spotifyTrackDataId}`,
			);
		}

		return { ...nextTrack, spotifyTrackData };
	},
});
