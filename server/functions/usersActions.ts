'use node';

import { v } from 'convex/values';
import { authedAction } from '../lib/authed';
import { api } from './_generated/api';

export const addUserToRoom = authedAction({
	args: {
		roomId: v.id('rooms'),
	},
	handler: async (ctx, args) => {
		const room = await ctx.runQuery(api.rooms.get, {
			roomId: args.roomId,
		});

		await ctx.runMutation(api.rooms.updateRoomListeners, {
			roomId: args.roomId,
			listeners: [
				...(room.details?.listeners ?? []),
				ctx.me.spotifyUserProfile,
			],
		});
	},
});
