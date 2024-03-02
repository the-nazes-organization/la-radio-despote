import { AddTrackButton } from '@/components/add-track-button';
import { TrackSkeleton } from '@/components/skeleton/track-skeleton';
import { TrackDisplay } from '@/components/track-display';
import { DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSearchSongs } from '@/lib/providers/react-query/queries';
import { useDebounce } from '@/lib/use-debounce';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Id } from 'server/functions/_generated/dataModel';

interface TrackSearchProps {
	roomId: Id<'rooms'>;
}

export const TrackSearch = ({ roomId }: TrackSearchProps) => {
	const [trackQuery, setTrackQuery] = useState('');
	const debouncedTrackQuery = useDebounce(trackQuery, 500);

	const { ref, inView } = useInView();

	const { data, error, fetchNextPage, isLoading, isFetchingNextPage } =
		useSearchSongs({
			trackQuery: debouncedTrackQuery,
		});

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [fetchNextPage, inView, debouncedTrackQuery]);

	return (
		<>
			<DialogDescription>
				Enter the name of the track you want to add to the queue.
			</DialogDescription>
			<Input
				placeholder="Looking for a song..."
				onChange={e => setTrackQuery(e.target.value)}
			/>
			<ScrollArea className=" max-h-80">
				{error && <div>Error: {error.message}</div>}
				{!isLoading && !data && !error && <div>No results</div>}
				<ul className="space-y-2 max-w-md">
					{isLoading &&
						Array.from({ length: 6 }).map((_, index) => (
							<TrackSkeleton key={index} />
						))}

					{data?.pages?.map((tracks, index) =>
						tracks ? (
							<React.Fragment key={`tracks-page-${index}`}>
								{tracks.items.map(track => (
									<li key={track.id} className=" flex items-center">
										<TrackDisplay track={track} />
										<AddTrackButton roomId={roomId} spotifyTrackId={track.id} />
									</li>
								))}
							</React.Fragment>
						) : null,
					)}
					{isFetchingNextPage &&
						Array.from({ length: 6 }).map((_, index) => (
							<TrackSkeleton key={index} />
						))}

					<div ref={ref} className="size-2"></div>
				</ul>
			</ScrollArea>
		</>
	);
};
