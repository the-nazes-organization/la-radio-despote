import { v } from 'convex/values';
import { authedAction } from '../../../lib/authed';
import { internal } from '../../_generated/api';
import { Doc } from '../../_generated/dataModel';

export const playNextTrack = authedAction({
	args: {
		roomId: v.id('rooms'),
	},
	handler: async (ctx, args) => {
		// We get current playing track
		const currentPlayingTrack = (await ctx.runQuery(
			internal.internal.player.queries.getPlayingTrack,
			{
				roomId: args.roomId,
			},
		)) as Doc<'tracks'>;

		// We cancel the current playing track
		if (currentPlayingTrack?.scheduledFunctionId) {
			await ctx.runMutation(
				internal.internal.scheduler.mutations.cancelScheduledFunction,
				{
					id: currentPlayingTrack.scheduledFunctionId,
				},
			);
		}

		await ctx.runAction(internal.internal.player.actions.playTrack, {
			roomId: args.roomId,
		});
	},
});
