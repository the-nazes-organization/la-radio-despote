'use node';

import { v } from 'convex/values';
import { spotifyApi } from '../lib/spotifyApi';
import { internal } from './_generated/api';
import { action } from './_generated/server';

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
			{
				name: track.name,
				duration: track.duration_ms,
				spotifyId: track.id,
				album: {
					id: track.album.id,
					name: track.album.name,
					images: track.album.images,
				},
				artists: track.artists.map(artist => ({
					id: artist.id,
					name: artist.name,
				})),
			},
		);

		await ctx.runMutation(internal.tracks.addTrackToQueue, {
			askedBy: args.userId,
			askedAt: Date.now(),
			duration: track.duration_ms,
			room: args.roomId,
			spotifyTrackDataId: trackDataId,
		});
	},
});
