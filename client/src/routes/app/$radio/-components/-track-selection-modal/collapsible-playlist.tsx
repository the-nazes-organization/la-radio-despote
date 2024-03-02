import { TypographyMuted } from '@/components/typography';
import { cn } from '@/lib/utils';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import React from 'react';
import { TracksList } from './tracks-list';

interface CollapsiblePlaylistProps {
	playlist: SimplifiedPlaylist;
}

export const CollapsiblePlaylist = ({ playlist }: CollapsiblePlaylistProps) => {
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<div className={cn('sticky top-0 bg-background', isOpen && 'py-2')}>
				<CollapsibleTrigger asChild>
					<div className="grid grid-cols-[40px_auto_20px] gap-4 max-w-md">
						{playlist.images[0]?.url ? (
							<img
								src={playlist.images[0]?.url}
								className="rounded-md place-self-center size-10"
							/>
						) : null}

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
				{isOpen && <TracksList playlistId={playlist.id} />}
			</CollapsibleContent>
		</Collapsible>
	);
};
