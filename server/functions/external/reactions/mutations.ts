import { v } from 'convex/values';
import { authedMutation } from '../../../lib/authed';

export const addLikeReaction = authedMutation({
	args: {
		roomId: v.id('rooms'),
	},
	handler: async (ctx, args) => {
		ctx.db.insert('reactions', {
			type: 'like',
			roomId: args.roomId,
			userId: ctx.me?._id!,
		});
	},
});
