import { useSearchSongs } from '@/lib/providers/react-query/queries';
import { useDebounce } from '@/lib/use-debounce';
import { Music } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Id } from 'server/functions/_generated/dataModel';
import { AddTrackButton } from './add-track-button';
import { TypographyMuted } from './typography';
import { Button } from './ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';

interface AddTrackModalButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	roomId: Id<'rooms'>;
	classname?: string;
}

export const AddTrackModalButton = ({
	roomId,
	classname,
}: AddTrackModalButtonProps) => {
	const [trackQuery, setTrackQuery] = useState('');
	const debouncedTrackQuery = useDebounce(trackQuery, 500);

	const { ref, inView } = useInView();

	const { data, error, fetchNextPage, isLoading } = useSearchSongs({
		trackQuery: debouncedTrackQuery,
	});

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [fetchNextPage, inView, debouncedTrackQuery]);

	return (
		<Dialog>
			<DialogTrigger asChild className={classname}>
				<Button className="md:space-x-2">
					<span className="hidden md:block">Add a track</span>
					<Music />+
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Search for a track</DialogTitle>
					<DialogDescription>
						Enter the name of the track you want to add to the queue.
					</DialogDescription>
				</DialogHeader>
				<Input
					placeholder="Looking for a song..."
					onChange={e => setTrackQuery(e.target.value)}
				/>
				<div className=" overflow-auto max-h-80">
					<ul className="space-y-2">
						{isLoading && <div>Loading...</div>}
						{error && <div>Error: {error.message}</div>}
						{!isLoading && !data && !error && <div>No results</div>}
						{data?.pages?.map((track, index) =>
							track ? (
								<React.Fragment key={`feed-page-${index}`}>
									{track.map(track => (
										<li key={track.id} className=" flex items-center">
											<div className="grid grid-cols-[40px_1fr] gap-4 grow">
												<img
													src={track.album.images[2].url}
													className="rounded-md place-self-center="
												/>

												<div>
													<div className="text-sm">{track.name}</div>
													<TypographyMuted className="text-xs">
														{track.artists[0].name}
													</TypographyMuted>
												</div>
											</div>
											<AddTrackButton
												roomId={roomId}
												spotifyTrackId={track.id}
											/>
										</li>
									))}
								</React.Fragment>
							) : null,
						)}

						<div ref={ref}></div>
					</ul>
				</div>
			</DialogContent>
		</Dialog>
	);
};
