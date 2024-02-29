'use node';

import { v } from 'convex/values';
import { spotifyApi } from '../../lib/spotifyApi';
import { api, internal } from '../_generated/api';
import { Doc, Id } from '../_generated/dataModel';
import { internalAction } from '../_generated/server';
import { formatTrack } from '../_helpers';

export const internalRequestTrack = internalAction({
	args: {
		spotifyTrackId: v.string(),
		userId: v.optional(v.id('users')),
		roomId: v.id('rooms'),
	},

	handler: async (ctx, args) => {
		const track = await spotifyApi.tracks.get(args.spotifyTrackId);

		const [spotifyTrackDataId] = await ctx.runMutation(
			internal.internal.tracks.mutations.saveSpotifyTrackData,
			{ tracksToSave: [formatTrack(track)] },
		);

		const trackId: Id<'tracks'> = await ctx.runMutation(
			internal.internal.tracks.mutations.insertTrackInDB,
			{
				askedBy: 'mockUserId' as Id<'users'>,
				askedAt: Date.now(),
				duration: track.duration_ms,
				room: args.roomId,
				spotifyTrackDataId,
			},
		);

		await ctx.runMutation(
			internal.internal.rooms.mutations.removeTrackFromRecommendations,
			{
				roomId: args.roomId,
				spotifyTrackDataId,
			},
		);

		await ctx.runAction(
			internal.dev.actions.internalGetAndUpdateRoomRecommendations,
			{
				roomId: args.roomId,
			},
		);

		return trackId;
	},
});

export const playTrack = internalAction({
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

		const room = await ctx.runQuery(internal.internal.rooms.queries.getRoom, {
			roomId: args.roomId,
		});
		if (!room.listeners.length) {
			return;
		}

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
				userId: 'mockUserId' as Id<'users'>,
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
			internal.dev.actions.playTrack, // MIGHT BE WRONG
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
			internal.dev.actions.internalGetAndUpdateRoomRecommendations,
			{
				roomId: args.roomId,
			},
		);
	},
});

export const internalGetAndUpdateRoomRecommendations = internalAction({
	args: {
		roomId: v.id('rooms'),
	},
	handler: async (ctx, args) => {
		const room = await ctx.runQuery(api.external.rooms.queries.get, {
			roomId: args.roomId,
		});

		if (!room) {
			throw new Error(
				'[ROOM - getAndUpdateRoomRecommendations]: Room not found',
			);
		}

		// We look for recommendations from playing track and queue
		const recommendationsBySpotify = await spotifyApi.recommendations.get({
			seed_tracks: [
				room.playing.spotifyTrackData.spotifyId,
				...room.queue.map(track => track.spotifyTrackData.spotifyId),
			],
			limit: 5,
		});

		// We save the recommendations
		const recommendedTrackIds = await ctx.runMutation(
			internal.internal.tracks.mutations.saveSpotifyTrackData,
			{ tracksToSave: recommendationsBySpotify.tracks.map(formatTrack) },
		);

		// We update the room with the recommendations
		await ctx.runMutation(
			internal.internal.rooms.mutations.updateRoomRecommendations,
			{
				roomId: args.roomId,
				recommendations: recommendedTrackIds,
			},
		);
	},
});
