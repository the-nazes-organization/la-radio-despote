import { v } from 'convex/values';
import { authedMutation } from '../../../lib/authed';
import { internal } from '../../_generated/api';

export const addUserToRoom = authedMutation({
	args: {
		roomId: v.id('rooms'),
	},
	handler: async (ctx, args) => {
		let room = await ctx.db.get(args.roomId);

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

		room = await ctx.db.get(args.roomId);
		if (room?.listeners?.length === 1) {
			const lastTrack = await ctx.db
				.query('tracks')
				.withIndex('by_room_played_at', q => q.eq('room', args.roomId))
				.order('desc')
				.first();

			if (!lastTrack) return;

			const timeRemaining =
				lastTrack && lastTrack?.playedAt
					? lastTrack.duration - (Date.now() - lastTrack?.playedAt)
					: 0;

			// add job to scheduler
			const scheduledFunctionId = await ctx.scheduler.runAfter(
				timeRemaining < 0 ? 0 : timeRemaining,
				internal.internal.player.actions.playTrack,
				{
					roomId: args.roomId,
					userId: ctx.me._id,
				},
			);

			// update track with scheduledFunctionId
			await ctx.db.patch(lastTrack._id, {
				scheduledFunctionId,
			});
		}
	},
});

export const removeUserFromRoom = authedMutation({
	args: {
		roomId: v.id('rooms'),
	},
	handler: async (ctx, args) => {
		let room = await ctx.db.get(args.roomId);

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

		room = await ctx.db.get(args.roomId);
		if (room?.listeners?.length === 0) {
			// get last track
			const currentPlayingTrack = await ctx.db
				.query('tracks')
				.withIndex('by_room_played_at')
				.order('desc')
				.first();

			if (!currentPlayingTrack || !currentPlayingTrack.scheduledFunctionId)
				return;

			// cancel it
			await ctx.scheduler.cancel(currentPlayingTrack.scheduledFunctionId);
		}
	},
});
