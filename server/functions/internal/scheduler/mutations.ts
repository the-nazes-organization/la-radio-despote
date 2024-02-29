import { v } from 'convex/values';
import { internalMutation } from '../../_generated/server';

export const cancelScheduledFunction = internalMutation({
	args: {
		id: v.id('_scheduled_functions'),
	},
	handler: async (ctx, args) => {
		await ctx.scheduler.cancel(args.id);
	},
});
