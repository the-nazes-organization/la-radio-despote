import { v } from 'convex/values';
import { authedMutation } from '../../../lib/authed';

/**
 * Deletes a track from the queue of a room.
 */
export const removeTrackFromQueue = authedMutation({
	args: {
		trackId: v.id('tracks'),
	},
	handler: async (ctx, args) => {
		return ctx.db.delete(args.trackId);
	},
});
