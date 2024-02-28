'use node';

import { v } from 'convex/values';
import { spotifyApi } from '../../lib/spotifyApi';
import { api, internal } from '../_generated/api';
import { action } from '../_generated/server';
import { formatTrack } from '../_helpers';

export const getAndUpdateRoomRecommendations = action({
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
				...room.queue
					.map(track => track.spotifyTrackData.spotifyId)
					.splice(0, 4),
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
