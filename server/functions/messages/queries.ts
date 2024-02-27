import { v } from 'convex/values';
import { query } from '../_generated/server';

export const listScheduledMessages = query({
	args: {},
	handler: async (ctx, args) => {
		return await ctx.db.system
			.query('_scheduled_functions')
			.withIndex('by_creation_time')
			.order('asc')
			.collect();
	},
});

export const getScheduledMessage = query({
	args: {
		id: v.id('_scheduled_functions'),
	},
	handler: async (ctx, args) => {
		return await ctx.db.system.get(args.id);
	},
});
