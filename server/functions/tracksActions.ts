'use node';

import { v } from 'convex/values';
import { spotifyApi } from '../lib/spotifyApi';
import { api, internal } from './_generated/api';
import { action } from './_generated/server';
import { formatTrack } from './_helpers';

export const requestTrack = action({
	args: {
		spotifyTrackId: v.string(),
		userId: v.optional(v.id('users')), // todo remove optional
		roomId: v.id('rooms'),
	},
	handler: async (ctx, args) => {
		const track = await spotifyApi.tracks.get(args.spotifyTrackId);

		const trackDataId = await ctx.runMutation(
			internal.tracks.saveSpotifyTrackData,
			{ tracksToSave: [formatTrack(track)] },
		);

		await ctx.runMutation(internal.tracks.addTrackToQueue, {
			askedBy: args.userId,
			askedAt: Date.now(),
			duration: track.duration_ms,
			room: args.roomId,
			spotifyTrackDataId: trackDataId[0],
		});
	},
});

export const playTrack = action({
	args: {
		roomId: v.id('rooms'),
	},
	handler: async (ctx, args) => {
		//We get current playing track
		const playingTrack = await ctx.runQuery(api.tracks.getPlayingTrack, {
			roomId: args.roomId,
		});

		//We update the track to set the playedAt field
		const now = Date.now();
		await ctx.runMutation(internal.tracks.updateTrack, {
			trackId: playingTrack._id!,
			playedAt: now,
		});

		// We schedule the next track to be played
		await ctx.scheduler.runAfter(
			playingTrack!.spotifyTrackData!.duration,
			api.tracksActions.playTrack,
			{ roomId: args.roomId },
		);

		// We look for recommendations
		const recommendationsBySpotify = await spotifyApi.recommendations.get({
			seed_tracks: [playingTrack.spotifyTrackData!.spotifyId],
		});

		// We save the recommendations
		const recommendedTrackIds = await ctx.runMutation(
			internal.tracks.saveSpotifyTrackData,
			{ tracksToSave: recommendationsBySpotify.tracks.map(formatTrack) },
		);

		// We update the room with the recommendations
		await ctx.runMutation(api.rooms.updateRecommendations, {
			roomId: args.roomId,
			recommendations: recommendedTrackIds,
		});
	},
});
