import { ConvexError, v } from 'convex/values';
import { authedMutation } from '../../../lib/authed';

export const addLikeReaction = authedMutation({
	args: {
		roomId: v.id('rooms'),
		trackId: v.id('tracks'),
		askedBy: v.union(v.id('users'), v.null()),
	},
	handler: async (ctx, args) => {
		const spotifyTrack = await ctx.db.get(args.trackId);
		if (!spotifyTrack) {
			throw new ConvexError('No played track found');
		}
		const spotifyTrackData = await ctx.db.get(spotifyTrack.spotifyTrackDataId);
		if (!spotifyTrackData) {
			throw new ConvexError('No spotifyTrackData found');
		}
		const spotifyId = spotifyTrackData.spotifyId;
		if (!spotifyId) {
			throw new Error('No spotifyId found for trackId');
		}

		const userId = ctx.me?._id;
		if (!userId) {
			throw new Error('No user found ');
		}

		const alreadyLiked = await ctx.db
			.query('reactions')
			.withIndex('by_user_by_likes_by_track', q =>
				q.eq('userId', userId).eq('type', 'like').eq('spotifyId', spotifyId),
			)
			.unique();
		if (alreadyLiked) {
			return;
		}

		return ctx.db.insert('reactions', {
			type: 'like',
			roomId: args.roomId,
			userId: ctx.me?._id!,
			spotifyId,
			askedBy: args.askedBy,
		});
	},
});
export const removeLikeReaction = authedMutation({
	args: {
		trackId: v.id('tracks'),
	},
	handler: async (ctx, args) => {
		const spotifyTrack = await ctx.db.get(args.trackId);
		if (!spotifyTrack) {
			throw new ConvexError('No played track found');
		}
		const spotifyTrackData = await ctx.db.get(spotifyTrack.spotifyTrackDataId);
		if (!spotifyTrackData) {
			throw new ConvexError('No spotifyTrackData found');
		}
		const spotifyId = spotifyTrackData.spotifyId;
		if (!spotifyId) {
			throw new Error('No spotifyId found for trackId');
		}

		const userId = ctx.me?._id;
		if (!userId) {
			throw new Error('No user found ');
		}

		const likedReaction = await ctx.db
			.query('reactions')
			.withIndex('by_user_by_likes_by_track', q =>
				q.eq('userId', userId).eq('type', 'like').eq('spotifyId', spotifyId),
			)
			.unique();
		if (!likedReaction) {
			return;
		}

		return ctx.db.delete(likedReaction._id);
	},
});
