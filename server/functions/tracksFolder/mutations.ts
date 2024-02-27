import { v } from 'convex/values';
import { Id } from '../_generated/dataModel';
import { internalMutation } from '../_generated/server';

export const updateTrackScheduledFunctionId = internalMutation({
	args: {
		trackId: v.id('tracks'),
		scheduledFunctionId: v.object({ jobId: v.id('_scheduled_functions') }),
	},
	handler: async (
		ctx,
		args: {
			trackId: Id<'tracks'>;
			scheduledFunctionId: { jobId: Id<'_scheduled_functions'> };
		},
	) => {
		return ctx.db.patch(args.trackId, {
			scheduledFunctionId: args.scheduledFunctionId?.jobId,
		});
	},
});
