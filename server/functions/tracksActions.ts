'use node';

import { v } from 'convex/values';
import { spotifyApi } from '../lib/spotifyApi';
import { api, internal } from './_generated/api';
import { Id } from './_generated/dataModel';
import { action } from './_generated/server';
import { formatTrack } from './_helpers';
import { authedAction } from '../lib/authed';

export const requestTrack = authedAction({
	args: {
		spotifyTrackId: v.string(),
		userId: v.optional(v.id('users')), // todo remove optional
		roomId: v.id('rooms'),
	},

	handler: async (ctx, args) => {
		console.log(`I AM ✅`, ctx.me.display_name);
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

		// const room = await ctx.runQuery(api.rooms.get, { roomId: args.roomId });
		// if (room.recommendations.includes(trackId)) {
		// }

		// if (test?.recommendations?.includes(trackId)) {
		// 	// const recommendations = room.recommendations.filter(
		// 	// 	recommendation => recommendation !== trackId,
		// 	// );
		// 	await ctx.runMutation(api.rooms.updateRoom, {
		// 		roomId: args.roomId,
		// 		// recommendations,
		// 	});
		// }

		await ctx.runMutation(api.rooms.removeTrackFromRecommendations, {
			roomId: args.roomId,
			spotifyTrackDataId,
		});

		return trackId;
	},
});

export const playTrack = action({
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

		// We schedule the next track to be played
		await ctx.scheduler.runAfter(
			nextTrackInQueue.spotifyTrackData.duration,
			api.tracksActions.playTrack,
			{ roomId: args.roomId },
		);

		// We look for recommendations
		const recommendationsBySpotify = await spotifyApi.recommendations.get({
			seed_tracks: [nextTrackInQueue.spotifyTrackData.spotifyId],
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
