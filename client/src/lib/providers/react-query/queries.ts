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
		queryFn: async ({ pageParam = 0 }: { pageParam: number }) => {
			if (!trackQuery.length) {
				return;
			}
			const elementsFound = await sdk.search(
				trackQuery,
				['track'],
				undefined,
				10,
				pageParam,
			);
			return elementsFound.tracks.items;
		},
		getNextPageParam: lastPage => {
			return lastPage?.length ?? 0;
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
