import { internalMutation } from './_generated/server';
import { addRoom, deleteAllRooms, getRooms } from './rooms';
import { addTrack, deleteAllTracks } from './tracks';
import { addUser, deleteAllUsers, getUsers } from './users';

export const emptyDatabase = internalMutation(async ctx => {
	await deleteAllUsers(ctx, {});
	await deleteAllRooms(ctx, {});
	await deleteAllTracks(ctx, {});

	await Promise.all(
		await ctx.db
			.query('spotifyTrackData')
			.collect()
			.then(docs => docs.map(doc => ctx.db.delete(doc._id))),
	);
});

export const seedDatabase = internalMutation(async ctx => {
	await addUser(ctx, {
		username: 'max',
		email: 'max@example.com',
		password: 'password',
	});
	await addUser(ctx, {
		username: 'ben',
		email: 'ben@example.com',
		password: 'password',
	});

	await addRoom(ctx, { name: 'Bamboche Radio' });
	await addRoom(ctx, { name: 'Room 2' });
	await addRoom(ctx, { name: 'Room 3' });

	const rooms = await getRooms(ctx, {});
	const users = await getUsers(ctx, {});
	if (!rooms || !users) {
		return;
	}

	const trackData = await ctx.db.insert('spotifyTrackData', {
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

	await addTrack(ctx, {
		askedBy: users[0]._id,
		duration: 100,
		room: rooms[0]._id,
		spotifyTrackDataId: trackData,
		playedAt: Date.now(),
		askedAt: Date.now() - 5400 * 1000,
	});

	return;
});
