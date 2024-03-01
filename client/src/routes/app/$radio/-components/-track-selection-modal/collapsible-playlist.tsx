import { AddTrackButton } from '@/components/add-track-button';
import { TrackDisplay } from '@/components/track-display';
import { TypographyMuted } from '@/components/typography';
import { useGetPlaylistTracks } from '@/lib/providers/react-query/queries';
import { cn } from '@/lib/utils';
import { Route } from '@/routes/app/$radio';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import React from 'react';
import { Id } from 'server/functions/_generated/dataModel';

interface CollapsiblePlaylistProps {
	playlist: SimplifiedPlaylist;
}

export const CollapsiblePlaylist = ({ playlist }: CollapsiblePlaylistProps) => {
	const params = Route.useParams<{ radio: Id<'rooms'> }>();
	const [isOpen, setIsOpen] = React.useState(false);

	const { data: playlistTracks, isLoading } = useGetPlaylistTracks(playlist.id);

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
			<div className={cn('sticky top-0 bg-background', isOpen && 'py-2')}>
				<CollapsibleTrigger asChild>
					<div className="grid grid-cols-[40px_auto_20px] gap-4 max-w-md">
						<img
							src={playlist.images[0].url}
							className="rounded-md place-self-center size-10"
						/>

						<div className="shrink">
							<div className="text-sm line-clamp-1">{playlist.name}</div>
							<TypographyMuted className="text-xs line-clamp-1">
								{playlist.description}
							</TypographyMuted>
						</div>
						<div className="ml-auto">
							{isOpen ? <ChevronDown size={24} /> : <ChevronLeft size={24} />}
						</div>
					</div>
				</CollapsibleTrigger>
			</div>
			<CollapsibleContent className="space-y-2">
				{isLoading && <div>Loading...</div>}

				{playlist && (
					<ul className="space-y-2">
						{playlistTracks?.tracks.items.map(({ track }) => (
							<li
								key={track.id}
								className="px-2 py-1 rounded flex items-center bg-secondary hover:bg-secondary/20"
							>
								<TrackDisplay track={track} />
								<AddTrackButton
									roomId={params.radio}
									spotifyTrackId={track.id}
								/>
							</li>
						)) ?? []}
					</ul>
				)}
			</CollapsibleContent>
		</Collapsible>
	);
};
