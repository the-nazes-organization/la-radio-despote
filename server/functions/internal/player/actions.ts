'use node';

import { v } from 'convex/values';
import { internal } from '../../_generated/api';
import { Id } from '../../_generated/dataModel';
import { internalAction } from '../../_generated/server';

export const playTrack = internalAction({
	args: {
		roomId: v.id('rooms'),
	},
	handler: async (ctx, args) => {
		// We get the next track in queue
		let nextTrackInQueue = await ctx.runQuery(
			internal.internal.rooms.queries.getNextTrackInQueue,
			{
				roomId: args.roomId,
			},
		);

		if (!nextTrackInQueue) {
			const recommendation = await ctx.runQuery(
				internal.internal.rooms.queries.getFirstRecommendatedTrack,
				{ roomId: args.roomId },
			);

			await ctx.runAction(internal.internal.tracks.actions.requestTrack, {
				roomId: args.roomId,
				spotifyTrackId: recommendation.spotifyId,
			});

			nextTrackInQueue = (await ctx.runQuery(
				internal.internal.rooms.queries.getNextTrackInQueue,
				{
					roomId: args.roomId,
				},
			))!;
		}

		// We update the track to set the playedAt field
		const now = Date.now();
		await ctx.runMutation(
			internal.internal.tracks.mutations.updateTrackPlaytime,
			{
				trackId: nextTrackInQueue._id,
				playedAt: now,
			},
		);

		// We schedule the next track to be played
		const scheduledFunctionId = (await ctx.scheduler.runAfter(
			nextTrackInQueue.spotifyTrackData.duration,
			internal.internal.player.actions.playTrack,
			{ roomId: args.roomId },
		)) as unknown as { jobId: Id<'_scheduled_functions'> };

		// We update the track to set the scheduledFunctionId field
		await ctx.runMutation(
			internal.internal.tracks.mutations.updateTrackScheduledFunctionId,
			{
				trackId: nextTrackInQueue._id,
				scheduledFunctionId: scheduledFunctionId.jobId,
			},
		);

		await ctx.runAction(
			internal.internal.rooms.actions.getAndUpdateRoomRecommendations,
			{
				roomId: args.roomId,
			},
		);
	},
});
