import { v } from 'convex/values';
import { mutation } from '../_generated/server';

export const cancelMessage = mutation({
	args: {
		id: v.id('_scheduled_functions'),
	},
	handler: async (ctx, args) => {
		await ctx.scheduler.cancel(args.id);
	},
});
