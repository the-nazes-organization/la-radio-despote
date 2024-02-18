import { internalMutation } from './_generated/server';

export const drop = internalMutation(async ctx => {
	return Promise.all(
		(['tracks', 'spotifyTrackData', 'rooms', 'users'] as const).map(
			async table => {
				return Promise.all(
					await ctx.db
						.query(table)
						.collect()
						.then(docs => docs.map(doc => ctx.db.delete(doc._id))),
				);
			},
		),
	);
});

export const seed = internalMutation(async ctx => {
	const max = await ctx.db.insert('users', {
		username: 'max',
		email: 'max@example.com',
		password: 'password',
	});

	await ctx.db.insert('users', {
		username: 'ben',
		email: 'ben@example.com',
		password: 'password',
	});

	const room = await ctx.db.insert('rooms', {
		name: 'Bamboche Radio',
		listeners: [],
	});

	const sampleTrackData = await ctx.db.insert('spotifyTrackData', {
		album: {
			id: '1F6pbvvDZVFepqnD3nnVI7',
			images: [
				{
					height: 640,
					url: 'https://i.scdn.co/image/ab67616d0000b27348e18170644d49d5bd44e3c1',
					width: 640,
				},
				{
					height: 300,
					url: 'https://i.scdn.co/image/ab67616d00001e0248e18170644d49d5bd44e3c1',
					width: 300,
				},
				{
					height: 64,
					url: 'https://i.scdn.co/image/ab67616d0000485148e18170644d49d5bd44e3c1',
					width: 64,
				},
			],
			name: 'Numbaz EP',
		},
		artists: [
			{
				id: '3XGGc2cdg65V8AOXGfdHwb',
				name: 'Franck',
			},
		],
		duration: 307966,
		spotifyId: '5EW0i7UltRvODlUXWOVE7l',
		name: 'Get Down',
		previewUrl:
			'https://p.scdn.co/mp3-preview/aed5ad751421daa9d749cb3e42ce7adbb73037e0?cid=2a67b948aa004e08afb92cb34295ce86',
	});

	await ctx.db.insert('tracks', {
		askedBy: max,
		duration: 100,
		room,
		spotifyTrackDataId: sampleTrackData,
		playedAt: Date.now(),
		askedAt: Date.now() - 5400 * 1000,
	});
});
