import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * List all rooms.
 */
export const list = query({
	args: {},
	handler: async ctx => {
		const rooms = await ctx.db.query('rooms').take(100);

		return Promise.all(
			rooms.map(async room => {
				const playingTrack = await ctx.db
					.query('tracks')
					.withIndex('by_room_played_at', q => q.eq('room', room._id))
					.order('desc')
					.first();

				const spotifyTrackData = await ctx.db.get(
					playingTrack!.spotifyTrackDataId,
				);

				return {
					...room,
					playing: { ...playingTrack, spotifyTrackData: spotifyTrackData! },
				};
			}),
		);
	},
});

/**
 * Get the detail of a room.
 */
export const get = query({
	args: { roomId: v.id('rooms') },
	handler: async (ctx, args) => {
		const detailsPromise = ctx.db.get(args.roomId);

		const queuePromise = ctx.db
			.query('tracks')
			.withIndex('by_room_played_at_asked_at', q =>
				q.eq('room', args.roomId).eq('playedAt', undefined),
			)
			.order('asc')
			.collect()
			.then(tracks =>
				tracks.map(async track => {
					const [spotifyTrackData, askedBy] = await Promise.all([
						ctx.db.get(track.spotifyTrackDataId),
						track.askedBy ? ctx.db.get(track.askedBy) : null,
					]);

					return {
						...track,
						spotifyTrackData: spotifyTrackData!,
						askedBy,
					};
				}),
			)
			.then(tracksPromises => Promise.all(tracksPromises));

		const playingPromise = ctx.db
			.query('tracks')
			.withIndex('by_room_played_at', q => q.eq('room', args.roomId))
			.order('desc')
			.first()
			.then(async track => {
				const spotifyTrackData = (await ctx.db.get(track!.spotifyTrackDataId))!;
				return {
					...track,
					spotifyTrackData,
				};
			});

		const recommendationsPromise = detailsPromise
			.then(details =>
				details!.recommendations?.map(_id => ctx.db.get(_id) ?? []),
			)
			.then(recommendationsPromises =>
				Promise.all(recommendationsPromises ?? []),
			);

		const [details, queue, playing, recommendations] = await Promise.all([
			detailsPromise,
			queuePromise,
			playingPromise,
			recommendationsPromise,
		]);

		return {
			details: details!,
			queue,
			playing: playing!,
			recommendations,
		};
	},
});

/**
 * Update recommendations.
 */
export const updateRoomRecommendations = mutation({
	args: {
		roomId: v.id('rooms'),
		recommendations: v.array(v.id('spotifyTrackData')),
	},
	handler: async (ctx, args) => {
		return ctx.db.patch(args.roomId, {
			recommendations: args.recommendations,
		});
	},
});
/**
 * Update listeners.
 */
export const updateRoomListeners = mutation({
	args: {
		roomId: v.id('rooms'),
		listeners: v.array(v.id('users')),
	},
	handler: async (ctx, args) => {
		return ctx.db.patch(args.roomId, {
			listeners: args.listeners,
		});
	},
});

export const getRecommendatedTrack = query({
	args: {
		roomId: v.id('rooms'),
	},
	handler: async (ctx, args) => {
		return ctx.db.get(args.roomId).then(async room => {
			const recommendation = await ctx.db.get(room!.recommendations[0]!);

			if (!recommendation) {
				throw new Error('No recommendations');
			}

			return recommendation;
		});
	},
});

export const removeTrackFromRecommendations = mutation({
	args: {
		roomId: v.id('rooms'),
		spotifyTrackDataId: v.id('spotifyTrackData'),
	},
	handler: async (ctx, args) => {
		const room = await ctx.db.get(args.roomId);
		const recommendations = room!.recommendations.filter(
			recommendation => recommendation !== args.spotifyTrackDataId,
		);
		return ctx.db.patch(args.roomId, {
			recommendations,
		});
	},
});
