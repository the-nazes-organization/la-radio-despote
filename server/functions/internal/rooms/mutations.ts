import { v } from 'convex/values';
import { internalMutation } from '../../_generated/server';

export const updateRoomRecommendations = internalMutation({
	args: {
		roomId: v.id('rooms'),
		recommendations: v.array(v.id('spotifyTrackData')),
	},
	handler: async (ctx, args) => {
		return ctx.db.patch(args.roomId, {
			recommendations: args.recommendations,
		});
	},
});

export const removeTrackFromRecommendations = internalMutation({
	args: {
		roomId: v.id('rooms'),
		spotifyTrackDataId: v.id('spotifyTrackData'),
	},
	handler: async (ctx, args) => {
		const room = await ctx.db.get(args.roomId);
		const recommendations = room!.recommendations.filter(
			recommendation => recommendation !== args.spotifyTrackDataId,
		);
		return ctx.db.patch(args.roomId, {
			recommendations,
		});
	},
});
