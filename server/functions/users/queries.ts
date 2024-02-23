import { v } from 'convex/values';
import { internalQuery, query } from '../_generated/server';

export const getUserSession = internalQuery({
	args: {
		token: v.string(),
	},
	async handler(ctx, args) {
		const session = await ctx.db
			.query('sessions')
			.withIndex('by_token', q => q.eq('token', args.token))
			.unique();

		if (!session) {
			return null;
		}

		return ctx.db.get(session.userId);
	},
});
