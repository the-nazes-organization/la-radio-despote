import { UserProfile } from '@spotify/web-api-ts-sdk';
import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { useSpotifyPlayerStore } from '../SpotifyPlayerProvider';

const sdk = useSpotifyPlayerStore.getState().sdk;

export const useSearchSongs = ({ trackQuery }: { trackQuery: string }) => {
	return useInfiniteQuery({
		initialPageParam: 0,
		queryKey: ['searchSongs', trackQuery],
		queryFn: async ({ pageParam }: { pageParam: number }) => {
			if (!trackQuery.length) {
				return {
					items: [],
					offset: 0,
					total: 0,
				};
			}
			const elementsFound = await sdk.search(
				trackQuery,
				['track'],
				undefined,
				10,
				pageParam,
			);
			return {
				...elementsFound.tracks,
			};
		},
		getNextPageParam: tracks => {
			return tracks.offset + tracks.items.length;
		},
	});
};

export const useLikeTrack = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['isLiked'],
		mutationFn: async ({
			isLiked,
			trackId,
		}: {
			isLiked: boolean;
			trackId: Spotify.Track['id'];
		}) => {
			if (trackId) {
				!isLiked
					? await sdk.currentUser.tracks.saveTracks([trackId])
					: await sdk.currentUser.tracks.removeSavedTracks([trackId]);
				return trackId;
			}
		},
		onSuccess: trackId => {
			queryClient.invalidateQueries({
				queryKey: ['track', trackId],
			});
		},
	});
};

export const useTrackIsLiked = (trackId: string | null | undefined) => {
	return useQuery({
		queryKey: ['track', trackId],
		queryFn: async () => {
			if (!trackId) return false;
			const [isLiked] = await sdk.currentUser.tracks.hasSavedTracks([trackId]);
			return isLiked;
		},
	});
};

export const useGetPlaylistTracks = ({
	playlistId,
}: {
	playlistId: 'savedTracks' | string;
}) => {
	return useInfiniteQuery({
		initialPageParam: 0,
		queryKey: ['playlist', playlistId],
		queryFn: async ({ pageParam }: { pageParam: number }) => {
			if (playlistId === 'savedTracks') {
				const savedTracks = await sdk.currentUser.tracks.savedTracks(
					20,
					pageParam,
				);
				return savedTracks;
			} else {
				const playlistItems = await sdk.playlists.getPlaylistItems(
					playlistId,
					undefined,
					undefined,
					20,
					pageParam,
				);
				return playlistItems;
			}
		},
		getNextPageParam: tracks => {
			return tracks.items.length
				? tracks.offset + tracks.items.length
				: undefined;
		},
	});
};

export const useGetUserPlaylists = (userProfileId: UserProfile['id']) => {
	return useQuery({
		queryKey: ['userPlaylists', userProfileId],
		queryFn: async () => {
			const playlists = await sdk.currentUser.playlists.playlists();
			return playlists.items.filter(
				playlist => playlist.tracks?.total && playlist.tracks?.total > 0,
			);
		},
	});
};
