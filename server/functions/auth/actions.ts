'use node';

import { AccessToken, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { v } from 'convex/values';
import { action } from '../_generated/server';
import { internal } from '../_generated/api';

export const createNewSessionInDatabase = action({
	args: {
		token: v.string(),
	},
	async handler(ctx, args) {
		const spotifyApi = SpotifyApi.withAccessToken(
			process.env.SPOTIFY_CLIENT_ID!,
			{ access_token: args.token } as AccessToken,
		);

		const me = await spotifyApi.currentUser.profile().catch(() => {
			throw new Error('Invalid token');
		});

		await ctx.runMutation(internal.auth.mutations.createSession, {
			token: args.token,
			spotifyUserProfile: {
				country: me.country,
				display_name: me.display_name,
				email: me.email,
				id: me.id,
				images: me.images,
			},
		});
	},
});
