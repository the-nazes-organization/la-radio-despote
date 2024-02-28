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
			internal.tracks.saveSpotifyTrackData,
			{ tracksToSave: [formatTrack(track)] },
		);

		const trackId: Id<'tracks'> = await ctx.runMutation(
			internal.tracks.addTrackToQueue,
			{
				askedBy: args.userId,
				askedAt: Date.now(),
				duration: track.duration_ms,
				room: args.roomId,
				spotifyTrackDataId,
			},
		);

		await ctx.runMutation(api.rooms.removeTrackFromRecommendations, {
			roomId: args.roomId,
			spotifyTrackDataId,
		});

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
		const room = await ctx.runQuery(api.rooms.get, {
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
			internal.tracks.saveSpotifyTrackData,
			{ tracksToSave: recommendationsBySpotify.tracks.map(formatTrack) },
		);

		// We update the room with the recommendations
		await ctx.runMutation(api.rooms.updateRoomRecommendations, {
			roomId: args.roomId,
			recommendations: recommendedTrackIds,
		});
	},
});
