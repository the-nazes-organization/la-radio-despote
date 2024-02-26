import {
	customAction,
	customMutation,
	customQuery,
} from 'convex-helpers/server/customFunctions.js';
import { v } from 'convex/values';
import { internal } from '../functions/_generated/api';
import { Doc } from '../functions/_generated/dataModel';
import { action, mutation, query } from '../functions/_generated/server';

export const authedQuery = customQuery(query, {
	args: { token: v.optional(v.string()) },
	input: async (ctx, { token, ...args }) => {
		if (!token /** et qu'on est pas en dév, si on est en train de seeder */) {
			throw new Error('pas cool');
		}

		const session = await ctx.db
			.query('sessions')
			.withIndex('by_token', q => q.eq('token', token))
			.unique();

		if (!session) {
			throw new Error('No session found');
		}

		return {
			ctx: { me: await ctx.db.get(session.userId), ...ctx },
			args,
		};
	},
});

export const authedMutation = customMutation(mutation, {
	args: { token: v.optional(v.string()) },
	input: async (ctx, { token, ...args }) => {
		if (!token /** et qu'on est pas en dév, si on est en train de seeder */) {
			throw new Error('pas cool');
		}

		const session = await ctx.db
			.query('sessions')
			.withIndex('by_token', q => q.eq('token', token))
			.unique();

		if (!session) {
			throw new Error('No session found');
		}

		return {
			ctx: { me: await ctx.db.get(session.userId), ...ctx },
			args,
		};
	},
});

/**
 * @todo
 */
export const authedAction = customAction(action, {
	args: { token: v.optional(v.string()) },
	input: async (ctx, { token, ...args }) => {
		if (process.env.DEV_API_KEY && action.name === 'seed') {
			return {
				ctx: {
					...ctx,
					me: {} as Doc<'users'>,
				},
				args: { ...args },
			};
		}
		if (!token) throw new Error('Token is required');

		const me = (await ctx.runQuery(internal.users.queries.getUserSession, {
			token,
		})) as Doc<'users'>;

		if (!me?._id) {
			throw new Error('No session found');
		}

		return {
			ctx: {
				...ctx,
				me: me,
			},
			args: { ...args },
		};
	},
});
