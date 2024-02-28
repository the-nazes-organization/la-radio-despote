'use node';

import { v } from 'convex/values';
import { authedAction } from '../../lib/authed';
import { spotifyApi } from '../../lib/spotifyApi';
import { api, internal } from '../_generated/api';
import { Doc, Id } from '../_generated/dataModel';
import { formatTrack } from '../_helpers';

export const skipTrack = authedAction({
	args: {
		roomId: v.id('rooms'),
	},
	handler: async (ctx, args) => {
		// We get current playing track
		const currentPlayingTrack = (await ctx.runQuery(
			api.roomsFolder.queries.getPlayingTrack,
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

		console.log('✅', ctx.me);

		await ctx.runAction(api.tracksActions.playTrack, {
			roomId: args.roomId,
		});
	},
});

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

		await ctx.runAction(
			api.roomsFolder.actions.getAndUpdateRoomRecommendations,
			{
				roomId: args.roomId,
			},
		);

		return trackId;
	},
});
