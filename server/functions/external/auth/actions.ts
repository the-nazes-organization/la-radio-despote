'use node';

import { AccessToken, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { ConvexError, v } from 'convex/values';
import { internal } from '../../_generated/api';
import { action } from '../../_generated/server';

export const createNewSessionInDatabase = action({
	args: {
		accessToken: v.string(),
		refreshToken: v.string(),
	},
	async handler(ctx, args) {
		const spotifyApi = SpotifyApi.withAccessToken(
			process.env.SPOTIFY_CLIENT_ID!,
			{ access_token: args.accessToken } as AccessToken,
		);

		const me = await spotifyApi.currentUser.profile().catch(() => {
			throw new ConvexError('Invalid token');
		});

		await ctx.runMutation(internal.internal.auth.mutations.createSession, {
			token: args.refreshToken,
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
