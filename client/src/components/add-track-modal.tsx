import type { Track } from '@spotify/web-api-ts-sdk';
import { Music } from 'lucide-react';
import { useState } from 'react';
import { Id } from 'server/functions/_generated/dataModel';
import { AddTrackButton } from './add-track-button';
import { RequestTrackForm } from './request-track-form';
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

interface AddTrackModalButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	roomId: Id<'rooms'>;
	classname?: string;
}

export const AddTrackModalButton = ({
	roomId,
	classname,
}: AddTrackModalButtonProps) => {
	const [results, setResults] = useState<Track[]>([]);

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
				<RequestTrackForm setResults={setResults} />
				<div className=" overflow-auto max-h-80">
					<ul className="space-y-2">
						{results.map(track => (
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
								<AddTrackButton roomId={roomId} spotifyTrackId={track.id} />
							</li>
						))}
					</ul>
				</div>
			</DialogContent>
		</Dialog>
	);
};
