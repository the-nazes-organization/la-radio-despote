import { internalMutation } from './_generated/server';
import { addRoom, deleteAllRooms, getRooms } from './rooms';
import { addTrack, deleteAllTracks } from './tracks';
import { addUser, deleteAllUsers, getUsers } from './users';

export const emptyDatabase = internalMutation(async ctx => {
	await deleteAllUsers(ctx, {});
	await deleteAllRooms(ctx, {});
	await deleteAllTracks(ctx, {});
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

	await addTrack(ctx, {
		asked_by: users[0]._id,
		duration: 100,
		room: rooms[0]._id,
		spotifyId: '5EW0i7UltRvODlUXWOVE7l',
		played_at: Date.now(),
		asked_at: Date.now() - 5400 * 1000,
	});

	await addTrack(ctx, {
		asked_by: users[1]._id,
		duration: 100,
		room: rooms[0]._id,
		spotifyId: '2CXgBOHvaylFWhzk8aoNPG',
		asked_at: Date.now() - 3600 * 1000,
	});

	await addTrack(ctx, {
		asked_by: users[0]._id,
		duration: 100,
		room: rooms[0]._id,
		spotifyId: '4GBsGOIT6k1w5zYeMSfCFN',
		asked_at: Date.now() - 1800 * 1000,
	});

	return;
});
