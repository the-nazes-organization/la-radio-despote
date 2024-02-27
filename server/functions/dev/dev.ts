import { internal } from '../_generated/api';
import { internalAction, internalMutation } from '../_generated/server';

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

const MAX_SPOTIFY_PROFILE = {
	country: 'FR',
	display_name: 'Maxime Og',
	email: 'maxime.organi@gmail.com',
	explicit_content: {
		filter_enabled: false,
		filter_locked: false,
	},
	external_urls: {
		spotify: 'https://open.spotify.com/user/1147861397',
	},
	followers: { href: null, total: 20 },
	href: 'https://api.spotify.com/v1/users/1147861397',
	id: '1147861397',
	images: [
		{
			height: 64,
			url: 'https://scontent-bru2-1.xx.fbcdn.net/v/t39.30808-1/243795514_10225217237610416_8953767907525881187_n.jpg?stp=c0.8.50.50a_cp0_dst-jpg_p50x50&_nc_cat=110&ccb=1-7&_nc_sid=4da83f&_nc_ohc=6aX7ZCOfgecAX8BV-zH&_nc_ht=scontent-bru2-1.xx&edm=AP4hL3IEAAAA&oh=00_AfAIQDFEA4lVDvd53yEVXX-5-VBY9MSCnkqFDUtwVQUPlQ&oe=65DABA52',
			width: 64,
		},
		{
			height: 300,
			url: 'https://scontent-bru2-1.xx.fbcdn.net/v/t39.30808-1/243795514_10225217237610416_8953767907525881187_n.jpg?stp=c0.53.320.320a_dst-jpg_p320x320&_nc_cat=110&ccb=1-7&_nc_sid=9e7101&_nc_ohc=6aX7ZCOfgecAX8BV-zH&_nc_ht=scontent-bru2-1.xx&edm=AP4hL3IEAAAA&oh=00_AfDFFZZ_MjKN3S0V8OrHvsJYL7zsVEVOyEo7OeGZosXISQ&oe=65DABA52',
			width: 300,
		},
	],
	product: 'premium',
	type: 'user',
	uri: 'spotify:user:1147861397',
};

export const seedInitialData = internalMutation(async ctx => {
	const userId = await ctx.db.insert('users', {
		loggedInAt: Date.now(),
		spotifyUserProfile: MAX_SPOTIFY_PROFILE,
	});

	// await ctx.db.insert('users', {
	// 	spotifyUserProfile: MAX_SPOTIFY_PROFILE,
	// 	loggedInAt: Date.now(),
	// });
	// await ctx.db.insert('users', {
	// 	username: 'ben',
	// 	email: 'ben@example.com',
	// 	password: 'password',
	// });

	const roomId = await ctx.db.insert('rooms', {
		name: 'Bamboche Radio',
		listeners: [],
		recommendations: [],
	});

	return { roomId, userId };
});

export const seed = internalAction(async ctx => {
	await ctx.runMutation(internal.dev.dev.drop, {});

	const { roomId, userId } = await ctx.runMutation(
		internal.dev.dev.seedInitialData,
		{},
	);

	await ctx.runAction(internal.dev.actions.internalRequestTrack, {
		roomId,
		spotifyTrackId: '4b67MDtD92iU5Rsys7yWgy',
		userId,
	});

	await ctx.runAction(internal.dev.actions.playTrack, {
		roomId,
	});
});
