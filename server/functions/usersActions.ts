'use node';

import { v } from 'convex/values';
import { action } from './_generated/server';

export const addUserToRoom = action({
	args: {
		roomId: v.id('rooms'),
	},
	handler: async (ctx, args) => {
		console.log('ctx 🥷', await ctx.auth.getUserIdentity());
		// const userSpotifyId = await spotifyApi.currentUser.profile().then(data => {
		// 	console.log('🐒 data', data);
		// 	return data;
		// });
		// console.log('🐒 userSpotifyId', userSpotifyId);
		// const room = await ctx.runMutation(api.rooms.updateRoomListeners,{
		// 	roomId: args.roomId,
		// 	userId: (await userSpotifyId).id
		// });

		// const spotifyUserProfileId = await ctx.runQuery(api.users.getSpotifyUserProfile,

		// let spotifyUserProfile = await ctx.runQuery(
		// 	api.users.getSpotifyUserProfile,
		// 	{
		// 		spotifyId: spotifyUserProfile.id,
		// 	},
		// );
		// // console.log('is user Found:', spotifyUserId, !spotifyUserId?._id);
		// if (!spotifyUserProfile?._id) {
		// 	spotifyUserProfile = await ctx.runMutation(
		// 		api.users.setSpotifyUserProfile,
		// 		{
		// 			userId: args.userId,
		// 			spotifyUserProfile: args.spotifyUserProfile,
		// 		},
		// 	);
		// }
		// const room = await ctx.runQuery(api.rooms.get, { roomId: args.roomId });

		// const currentUserInRoom = room.details?.listeners?.includes(
		// 	spotifyUserProfile?._id!,
		// );
		// await ctx.runMutation(api.rooms.updateRoomListeners, {
		// 	roomId: args.roomId,
		// 	listeners:
		// 		!currentUserInRoom && spotifyUserProfile?._id
		// 			? [...room.details.listeners, spotifyUserProfile._id]
		// 			: room.details?.listeners,
		// });
		// return;
	},
});
