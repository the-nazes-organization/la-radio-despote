import { v } from 'convex/values';
import { authedAction } from '../../lib/authed';
import { api } from '../_generated/api';
import { Doc } from '../_generated/dataModel';

export const skipTrack = authedAction({
	args: {
		roomId: v.id('rooms'),
	},
	handler: async (ctx, args) => {
		// We get current playing track
		const currentPlayingTrack = (await ctx.runQuery(
			api.rooms2.queries.getCurrentTracks,
			{
				roomId: args.roomId,
			},
		)) as Doc<'tracks'>;

		// We cancel the current playing track
		if (currentPlayingTrack?.scheduledFunctionId) {
			await ctx.runMutation(api.messages.mutations.cancelMessage, {
				id: currentPlayingTrack.scheduledFunctionId,
			});
		}

		await ctx.runAction(api.tracksActions.playTrack, {
			roomId: args.roomId,
		});
	},
});
