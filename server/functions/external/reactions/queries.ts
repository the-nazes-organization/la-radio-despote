import { v } from 'convex/values';
import { query } from '../../_generated/server';

export const getReactions = query({
	args: {
		roomId: v.id('rooms'),
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query('reactions')
			.withIndex('by_room', q => q.eq('roomId', args.roomId))
			.collect();
	},
});
