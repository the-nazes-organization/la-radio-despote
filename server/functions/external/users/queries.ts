import { v } from 'convex/values';
import { query } from '../../_generated/server';

export const getUser = query({
	args: { spotifyUserId: v.string() },
	handler: async (ctx, args) => {
		const userProfile = await ctx.db
			.query('users')
			.withIndex('by_spotify_user_id', q =>
				q.eq('spotifyUserProfile.id', args.spotifyUserId),
			)
			.unique();
		if (!userProfile) throw new Error('User not found');

		const recentlyAskedTracks = await ctx.db
			.query('tracks')
			.withIndex('by_asked_by', q => q.eq('askedBy', userProfile?._id))
			.order('desc')
			.collect()
			.then(async tracks => {
				const tracksWithRoomAndSpotifyTrackData = tracks.map(async track => {
					const room = await ctx.db.get(track.room);
					const spotifyTrackData = await ctx.db.get(track.spotifyTrackDataId);
					return { ...track, room, spotifyTrackData };
				});
				const completedPromises = Promise.all(
					tracksWithRoomAndSpotifyTrackData,
				);
				return completedPromises;
			});

		const tracksLikedByUser = await ctx.db
			.query('reactions')
			.withIndex('by_user_by_likes', q =>
				q.eq('userId', userProfile?._id).eq('type', 'like'),
			)
			.collect()
			.then(async reactions => {
				const tracks = await Promise.all(
					reactions.map(async reaction => {
						const track = await ctx.db.get(reaction._id);
						if (!track) return;
						const spotifyTrackData = await ctx.db
							.query('spotifyTrackData')
							.withIndex('by_spotify_id', q =>
								q.eq('spotifyId', track.spotifyId),
							)
							.unique();
						return { ...track, spotifyTrackData };
					}),
				);
				return tracks;
			});

		const tracksLikedByOthers = await ctx.db
			.query('reactions')
			.withIndex('by_author_by_likes', q => q.eq('askedBy', userProfile?._id))
			.collect()
			.then(async reactions => {
				const tracks = reactions.reduce(
					(acc, reaction) => {
						if (!reaction.spotifyId) return acc;
						if (!acc[reaction.spotifyId]) {
							acc[reaction.spotifyId] = 1;
						} else {
							acc[reaction.spotifyId] += 1;
						}
						return acc;
					},
					{} as Record<string, number>,
				);

				const tracksWithSpotifyTrackData = await Promise.all(
					Object.entries(tracks).map(async ([spotifyTrackId, likes]) => {
						const track = await ctx.db
							.query('spotifyTrackData')
							.withIndex('by_spotify_id', q =>
								q.eq('spotifyId', spotifyTrackId),
							)
							.unique();
						if (!track) return;
						return { ...track, likes };
					}),
				);
				return tracksWithSpotifyTrackData.sort((a, b) =>
					a && b ? b.likes - a.likes : 0,
				);
			});

		return {
			userProfile,
			recentlyAskedTracks,
			tracksLikedByUser,
			tracksLikedByOthers,
		};
	},
});
