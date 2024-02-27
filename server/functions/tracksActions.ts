'use node';

import { v } from 'convex/values';
import { authedAction } from '../lib/authed';
import { spotifyApi } from '../lib/spotifyApi';
import { api, internal } from './_generated/api';
import { Id } from './_generated/dataModel';
import { formatTrack } from './_helpers';

export const requestTrack = authedAction({
	args: {
		spotifyTrackId: v.string(),
		userId: v.optional(v.id('users')), // todo remove optional
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

		await ctx.runAction(api.rooms2.actions.getAndUpdateRoomRecommendations, {
			roomId: args.roomId,
		});

		return trackId;
	},
});

export const playTrack = authedAction({
	args: {
		roomId: v.id('rooms'),
	},
	handler: async (ctx, args) => {
		// We get current playing track
		let nextTrackInQueue = await ctx.runQuery(api.tracks.getNextTrackInQueue, {
			roomId: args.roomId,
		});

		if (!nextTrackInQueue) {
			const recommendation = await ctx.runQuery(
				api.rooms.getRecommendatedTrack,
				{ roomId: args.roomId },
			);

			await ctx.runAction(api.tracksActions.requestTrack, {
				roomId: args.roomId,
				spotifyTrackId: recommendation.spotifyId,
				token: '',
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

		// // We schedule the next track to be played
		// await ctx.scheduler.runAfter(
		// 	nextTrackInQueue.spotifyTrackData.duration,
		// 	api.tracksActions.playTrack,
		// 	{ roomId: args.roomId },
		// );

		await ctx.runAction(api.rooms2.actions.getAndUpdateRoomRecommendations, {
			roomId: args.roomId,
		});
	},
});
