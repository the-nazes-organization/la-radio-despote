import { v } from 'convex/values';
import { internalMutation, mutation } from './_generated/server';

export const addTrack = mutation({
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

export const saveTrackData = internalMutation({
	args: {
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
	},

	handler: async (ctx, args) => {
		return ctx.db.insert('spotifyTrackData', args);
	},
});

export const saveTrack = internalMutation(async ctx => {
	const track = await ctx.db.insert('spotifyTrackData', {
		duration: 1000,
		name: 'track name',
		spotifyId: 'spotifyId',
		artists: [
			{
				id: 'artistId',
				name: 'artist name',
			},
		],
		album: {
			id: 'albumId',
			name: 'album name',
			images: [
				{
					url: 'image url',
					height: 100,
					width: 100,
				},
			],
		},
		previewUrl: 'preview url',
	});
});

export const deleteAllTracks = internalMutation(async ctx => {
	const tracks = await ctx.db.query('tracks').collect();
	await Promise.all(tracks.map(track => ctx.db.delete(track._id)));
});
