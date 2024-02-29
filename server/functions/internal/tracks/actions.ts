'use node';
import { v } from 'convex/values';
import { spotifyApi } from '../../../lib/spotifyApi';
import { internal } from '../../_generated/api';
import { Id } from '../../_generated/dataModel';
import { internalAction } from '../../_generated/server';
import { formatTrack } from '../../_helpers';

export const requestTrack = internalAction({
	args: {
		spotifyTrackId: v.string(),
		userId: v.optional(v.id('users')), // todo remove optional
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
				askedBy: args.userId,
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
			internal.internal.rooms.actions.getAndUpdateRoomRecommendations,
			{
				roomId: args.roomId,
			},
		);

		return trackId;
	},
});
