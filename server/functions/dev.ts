import { api, internal } from './_generated/api';
import { internalAction, internalMutation } from './_generated/server';

export const drop = internalMutation(async ctx => {
	for (const table of [
		'tracks',
		'spotifyTrackData',
		'rooms',
		'users',
	] as const) {
		const docs = await ctx.db.query(table).collect();

		await Promise.all(docs.map(doc => ctx.db.delete(doc._id)));
	}
});

export const seedInitialData = internalMutation(async ctx => {
	const userId = await ctx.db.insert('users', {
		username: 'max',
		email: 'max@example.com',
		password: 'password',
	});

	await ctx.db.insert('users', {
		username: 'ben',
		email: 'ben@example.com',
		password: 'password',
	});

	const roomId = await ctx.db.insert('rooms', {
		name: 'Bamboche Radio',
		listeners: [],
		recommendations: [],
	});

	return { roomId, userId };
});

export const seed = internalAction(async ctx => {
	await ctx.runMutation(internal.dev.drop, {});

	const { roomId, userId } = await ctx.runMutation(
		internal.dev.seedInitialData,
		{},
	);

	await ctx.runAction(api.tracksActions.requestTrack, {
		roomId,
		spotifyTrackId: '4b67MDtD92iU5Rsys7yWgy',
		userId,
	});

	await ctx.runAction(api.tracksActions.playTrack, {
		roomId,
	});
});
