'use node';

import { v } from 'convex/values';
import { authedAction } from '../lib/authed';
import { api, internal } from './_generated/api';
import { Id } from './_generated/dataModel';

export const playTrack = authedAction({
	args: {
		roomId: v.id('rooms'),
	},
	handler: async (ctx, args) => {
		// We get the next track in queue
		let nextTrackInQueue = await ctx.runQuery(api.tracks.getNextTrackInQueue, {
			roomId: args.roomId,
		});

		if (!nextTrackInQueue) {
			const recommendation = await ctx.runQuery(
				api.rooms.getRecommendatedTrack,
				{ roomId: args.roomId },
			);

			await ctx.runAction(api.tracksFolder.actions.requestTrack, {
				roomId: args.roomId,
				spotifyTrackId: recommendation.spotifyId,
			});

			nextTrackInQueue = (await ctx.runQuery(api.tracks.getNextTrackInQueue, {
				roomId: args.roomId,
			}))!;
		}

		// We update the track to set the playedAt field
		const now = Date.now();
		await ctx.runMutation(internal.tracks.updateTrack, {
			trackId: nextTrackInQueue._id,
			playedAt: now,
		});

		// We schedule the next track to be played
		const scheduledFunctionId = (await ctx.scheduler.runAfter(
			nextTrackInQueue.spotifyTrackData.duration,
			api.tracksActions.playTrack,
			{ roomId: args.roomId },
		)) as unknown as { jobId: Id<'_scheduled_functions'> };

		// We update the track to set the scheduledFunctionId field
		await ctx.runMutation(
			internal.tracksFolder.mutations.updateTrackScheduledFunctionId,
			{
				trackId: nextTrackInQueue._id,
				scheduledFunctionId: scheduledFunctionId.jobId,
			},
		);

		await ctx.runAction(api.rooms2.actions.getAndUpdateRoomRecommendations, {
			roomId: args.roomId,
		});
	},
});
