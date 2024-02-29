import { v } from 'convex/values';
import { internalQuery } from '../../_generated/server';

export const getUser = internalQuery({
	args: {
		token: v.string(),
	},
	async handler(ctx, args) {
		const session = await ctx.db
			.query('sessions')
			.withIndex('by_token', q => q.eq('token', args.token))
			.first();
		// .unique();

		if (!session) {
			return null;
		}

		const user = await ctx.db.get(session.userId);

		return user;
	},
});
