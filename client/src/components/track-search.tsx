import { useSpotifyPlayerStore } from '@/lib/providers/SpotifyPlayerProvider';
import { useAction } from 'convex/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { api } from 'server';
import { Id } from 'server/functions/_generated/dataModel';
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

interface TrackSearchProps {
	roomId: Id<'rooms'>;
}

export const TrackSearch = ({ roomId }: TrackSearchProps) => {
	const player = useSpotifyPlayerStore();
	const requestTrack = useAction(api.tracksActions.requestTrack);

	const [query, setQuery] = useState('');
	const [results, setResults] = useState<any>([]);

	const handleSearch = async () => {
		const elementsFound = await player.sdk.search(
			query,
			['track'],
			undefined,
			10,
		);
		console.log('elementsFound', elementsFound);
		setResults(elementsFound.tracks.items);
	};

	console.log('results', results);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Add a track</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Search for a track</DialogTitle>
					<DialogDescription>
						Enter the name of the track you want to add to the queue.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Input
							id="name"
							defaultValue="Pedro Duarte"
							className="col-span-3"
							placeholder="Search for a track"
							value={query ?? ''}
							onChange={e => setQuery(e.target.value)}
						/>
						<Button type="submit" size={'icon'} onClick={handleSearch}>
							<Search />
						</Button>
					</div>
				</div>
				<div className=" overflow-auto max-h-80">
					<ul className="space-y-2">
						{results.map((track: any) => (
							<li key={track._id} className=" flex">
								<div className="grid grid-cols-[40px_1fr] gap-4">
									<img src={track.album.images[2].url} className="rounded-md" />

									<div>
										<div className="text-sm">{track.name}</div>
										<TypographyMuted className="text-xs">
											{track.artists[0].name}
										</TypographyMuted>
									</div>
								</div>
								<Button
									className="ml-auto"
									onClick={async () => {
										requestTrack({
											spotifyTrackId: track.id,
											roomId: roomId,
										}).then(d => console.log('✅', d));
									}}
								>
									<Plus />
								</Button>
							</li>
						))}
					</ul>
				</div>
			</DialogContent>
		</Dialog>
	);
};
