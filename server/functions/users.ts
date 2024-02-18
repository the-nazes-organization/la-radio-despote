import { v } from 'convex/values';
import { internalMutation, mutation, query } from './_generated/server';

export const getUsers = query({
	args: {},
	handler: async ctx => {
		return ctx.db.query('users').collect();
	},
});

export const addUser = mutation({
	args: { username: v.string(), email: v.string(), password: v.string() },
	handler: async (ctx, args) => {
		return ctx.db.insert('users', {
			username: args.username,
			email: args.email,
			password: args.password,
		});
	},
});

export const deleteAllUsers = internalMutation(async ctx => {
	const users = await ctx.db.query('users').collect();
	await Promise.all(users.map(user => ctx.db.delete(user._id)));
});
