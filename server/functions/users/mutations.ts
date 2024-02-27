import { v } from 'convex/values';
import { authedMutation } from '../../lib/authed';

export const addUserToRoom = authedMutation({
	args: {
		roomId: v.id('rooms'),
	},
	handler: async (ctx, args) => {
		const room = await ctx.db.get(args.roomId);

		if (!room) {
			throw new Error('[ROOM - addUserToRoom]: Room not found');
		}
		if (!ctx?.me) {
			throw new Error('[ROOM - addUserToRoom]: User not found');
		}

		const userId = ctx.me.spotifyUserProfile.id;

		const userAlreadyInRoom = room?.listeners?.some(
			listener => listener.id === userId,
		);
		const listeners = userAlreadyInRoom
			? room?.listeners
			: [...(room?.listeners ?? []), ctx.me.spotifyUserProfile];

		await ctx.db.patch(args.roomId, {
			listeners,
		});
	},
});

export const removeUserFromRoom = authedMutation({
	args: {
		roomId: v.id('rooms'),
	},
	handler: async (ctx, args) => {
		const room = await ctx.db.get(args.roomId);

		if (!room) {
			throw new Error('[ROOM - addUserToRoom]: Room not found');
		}
		if (!ctx.me) {
			throw new Error('[ROOM - addUserToRoom]: User not found');
		}

		const myId = ctx.me.spotifyUserProfile.id;

		await ctx.db.patch(args.roomId, {
			listeners: room?.listeners?.filter(listener => listener.id !== myId),
		});
	},
});