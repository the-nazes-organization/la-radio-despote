import { useInfiniteQuery } from '@tanstack/react-query';
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
