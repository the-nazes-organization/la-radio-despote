import { v } from 'convex/values';
import { internalQuery } from '../../_generated/server';

export const getPlayingTrack = internalQuery({
	args: {
		roomId: v.id('rooms'),
	},
	handler: async (ctx, args) => {
		const room = await ctx.db.get(args.roomId);

		if (!room) {
			throw new Error('[ROOM - getPlayingTrack]: Room not found');
		}

		const currentPlayingTrack = await ctx.db
			.query('tracks')
			.withIndex('by_room_played_at')
			.order('desc')
			.first();

		if (!currentPlayingTrack) {
			return null;
		}

		return currentPlayingTrack;
	},
});
