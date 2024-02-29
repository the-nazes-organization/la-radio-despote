import { v } from 'convex/values';
import { Id } from '../../_generated/dataModel';
import { internalMutation } from '../../_generated/server';

export const updateTrackScheduledFunctionId = internalMutation({
	args: {
		trackId: v.id('tracks'),
		scheduledFunctionId: v.id('_scheduled_functions'),
	},
	handler: async (
		ctx,
		args: {
			trackId: Id<'tracks'>;
			scheduledFunctionId: Id<'_scheduled_functions'>;
		},
	) => {
		return ctx.db.patch(args.trackId, {
			scheduledFunctionId: args.scheduledFunctionId,
		});
	},
});

export const updateTrackPlaytime = internalMutation({
	args: {
		trackId: v.id('tracks'),
		playedAt: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		return ctx.db.patch(args.trackId, { playedAt: args.playedAt });
	},
});

export const saveSpotifyTrackData = internalMutation({
	args: {
		tracksToSave: v.array(
			v.object({
				duration: v.number(),
				name: v.string(),
				spotifyId: v.string(),
				artists: v.array(
					v.object({
						id: v.string(),
						name: v.string(),
					}),
				),
				album: v.object({
					id: v.string(),
					name: v.string(),
					images: v.array(
						v.object({
							url: v.string(),
							height: v.number(),
							width: v.number(),
						}),
					),
				}),
				previewUrl: v.optional(v.string()),
			}),
		),
	},

	handler: async (ctx, args) => {
		return Promise.all(
			args.tracksToSave.map(async track => {
				const existing = await ctx.db
					.query('spotifyTrackData')
					.withIndex('by_spotify_id', q => q.eq('spotifyId', track.spotifyId))
					.unique();

				return existing
					? ctx.db.patch(existing._id, track).then(() => existing._id)
					: ctx.db.insert('spotifyTrackData', track);
			}),
		);
	},
});

export const insertTrackInDB = internalMutation({
	args: {
		askedBy: v.optional(v.id('users')),
		duration: v.number(),
		playedAt: v.optional(v.number()),
		askedAt: v.number(),
		room: v.id('rooms'),
		spotifyTrackDataId: v.id('spotifyTrackData'),
	},
	handler: async (ctx, args) => {
		return ctx.db.insert('tracks', {
			askedBy: args.askedBy,
			askedAt: args.askedAt,
			duration: args.duration,
			room: args.room,
			spotifyTrackDataId: args.spotifyTrackDataId,
			playedAt: args.playedAt,
		});
	},
});
