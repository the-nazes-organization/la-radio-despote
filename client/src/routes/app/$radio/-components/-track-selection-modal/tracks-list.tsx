import { AddTrackButton } from '@/components/add-track-button';
import { TrackSkeleton } from '@/components/skeleton/track-skeleton';
import { TrackDisplay } from '@/components/track-display';
import { useGetPlaylistTracks } from '@/lib/providers/react-query/queries';
import { Route } from '@/routes/app/$radio';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Id } from 'server/functions/_generated/dataModel';

interface TracksListProps {
	playlistId: string;
}

export const TracksList = ({ playlistId }: TracksListProps) => {
	const params = Route.useParams<{ radio: Id<'rooms'> }>();

	const {
		data: playlistTracks,
		isLoading,
		fetchNextPage,
		isFetchingNextPage,
		error,
		hasNextPage,
	} = useGetPlaylistTracks({ playlistId });

	const { ref, inView } = useInView();

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [fetchNextPage, inView]);
	return (
		<>
			{error && <div>Error: {error.message}</div>}
			{!isLoading && !playlistTracks && !error && <div>No results</div>}

			<ul className="space-y-2">
				{isLoading &&
					Array.from({ length: 6 }).map((_, index) => (
						<TrackSkeleton
							key={`track-skeleton-before-${playlistId}-${index}`}
						/>
					))}
				{playlistTracks?.pages?.map(tracksPage =>
					tracksPage ? (
						<React.Fragment
							key={`tracksPage-${playlistId}-${tracksPage.offset}`}
						>
							{tracksPage.items.map(({ track }) => (
								<li
									key={`track-${playlistId}-${track.id}`}
									className="px-2 py-1 rounded flex items-center bg-secondary hover:bg-secondary/20"
								>
									<TrackDisplay track={track} />
									<AddTrackButton
										roomId={params.radio}
										spotifyTrackId={track.id}
									/>
								</li>
							))}
						</React.Fragment>
					) : null,
				)}
				{isFetchingNextPage &&
					Array.from({ length: 6 }).map((_, index) => (
						<TrackSkeleton
							key={`track-skeleton-after-${playlistId}-${index}`}
						/>
					))}

				{hasNextPage && <div ref={ref} className="size-2"></div>}
			</ul>
		</>
	);
};
