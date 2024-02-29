import { v } from 'convex/values';
import { internalMutation } from '../../_generated/server';
import { spotifyUserProfileSchema } from '../../schema';

export const createSession = internalMutation({
	args: {
		token: v.string(),
		spotifyUserProfile: spotifyUserProfileSchema,
	},
	async handler(ctx, args) {
		const existingUser = await ctx.db
			.query('users')
			.withIndex('by_spotify_user_id', q =>
				q.eq('spotifyUserProfile.id', args.spotifyUserProfile.id),
			)
			.unique();

		if (existingUser) {
			await Promise.all([
				ctx.db.insert('sessions', {
					token: args.token,
					userId: existingUser._id,
				}),

				await ctx.db.patch(existingUser._id, {
					spotifyUserProfile: args.spotifyUserProfile,
					loggedInAt: Date.now(),
				}),
			]);

			return;
		}

		const newUserId = await ctx.db.insert('users', {
			spotifyUserProfile: args.spotifyUserProfile,
			loggedInAt: Date.now(),
		});

		return ctx.db.insert('sessions', {
			token: args.token,
			userId: newUserId,
		});
	},
});
