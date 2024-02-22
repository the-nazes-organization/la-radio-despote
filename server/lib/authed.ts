import { AccessToken, SpotifyApi, UserProfile } from '@spotify/web-api-ts-sdk';
import {
	customAction,
	customMutation,
	customQuery,
} from 'convex-helpers/server/customFunctions.js';
import { v } from 'convex/values';
import { action, mutation, query } from '../functions/_generated/server';

const validateUser = (access_token: string) => {
	const spotifyApi = SpotifyApi.withAccessToken(
		process.env.SPOTIFY_CLIENT_ID!,
		{ access_token } as AccessToken,
	);

	return spotifyApi.currentUser.profile();
};

export const authedQuery = customQuery(query, {
	args: { token: v.optional(v.string()) },
	input: async (ctx, { token, ...args }) => {
		if (!token && !('me' in ctx)) throw new Error('Token is required');
		if ('me' in ctx)
			return { ctx: { ...ctx, me: ctx.me as UserProfile }, args };

		return {
			ctx: { me: await validateUser(token as string), ...ctx },
			args,
		};
	},
});

export const authedMutation = customMutation(mutation, {
	args: { token: v.optional(v.string()) },
	input: async (ctx, { token, ...args }) => {
		if (!token && !('me' in ctx)) throw new Error('Token is required');
		if ('me' in ctx)
			return { ctx: { ...ctx, me: ctx.me as UserProfile }, args };

		return {
			ctx: { me: await validateUser(token as string), ...ctx },
			args,
		};
	},
});

export const authedAction = customAction(action, {
	args: { token: v.optional(v.string()) },
	input: async (ctx, { token, ...args }) => {
		if (!token && !('me' in ctx)) throw new Error('Token is required');
		if ('me' in ctx)
			return { ctx: { ...ctx, me: ctx.me as UserProfile }, args };

		return {
			ctx: { me: await validateUser(token as string), ...ctx },
			args,
		};
	},
});
