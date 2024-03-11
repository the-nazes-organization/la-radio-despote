import {
	customAction,
	customMutation,
	customQuery,
} from 'convex-helpers/server/customFunctions.js';
import { GenericActionCtx } from 'convex/server';
import { ConvexError, v } from 'convex/values';
import { internal } from '../functions/_generated/api';
import { DataModel, Doc } from '../functions/_generated/dataModel';
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
			throw new ConvexError('Query: No session found');
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
			.first();
		// .unique();

		if (!session) {
			throw new ConvexError('Mutation: No session found');
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
	input: async (
		ctx: GenericActionCtx<DataModel> & { me?: Doc<'users'> },
		{ token, ...args },
	) => {
		if (ctx.me) {
			return { ctx, args };
		}

		if (!token) {
			throw new Error('Token is required if auth is not already in ctx');
		}

		const me = (await ctx.runQuery(internal.internal.users.queries.getUser, {
			token,
		})) as Doc<'users'>;

		if (!me?._id) {
			throw new ConvexError({
				message: 'No session found',
				status: 401,
			});
		}

		return {
			ctx: {
				...ctx,
				me: me,
			},
			args,
		};
	},
});
