import { TypographyMuted } from '@/components/typography';
import { cn } from '@/lib/utils';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk';
import { ChevronDown, ChevronLeft, Heart } from 'lucide-react';
import React from 'react';
import { TracksList } from './tracks-list';

interface CollapsiblePlaylistProps {
	playlist: Pick<SimplifiedPlaylist, 'id' | 'name' | 'description' | 'images'>;
}

const defaultPlaylistCover: Record<string, JSX.Element> = {
	savedTracks: (
		<div className="size-10 bg-gradient-to-br from-indigo-500 to-white rounded flex items-center justify-center">
			<Heart className="fill-white" />
		</div>
	),
};

export const CollapsiblePlaylist = ({ playlist }: CollapsiblePlaylistProps) => {
	const [isOpen, setIsOpen] = React.useState(false);

	const { id, name, description, images } = playlist;
	return (
		<>
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<div className={cn('sticky top-0 bg-background', isOpen && 'py-2')}>
					<CollapsibleTrigger asChild>
						<div className="grid grid-cols-[40px_auto_20px] gap-4 max-w-md">
							{images[0]?.url ? (
								<img
									src={images[0]?.url}
									className="rounded-md place-self-center size-10"
								/>
							) : (
								defaultPlaylistCover[id] ?? null
							)}

							<div className="shrink self-center">
								<div className="text-sm line-clamp-1">{name}</div>
								{description && (
									<TypographyMuted className="text-xs line-clamp-1">
										{description}
									</TypographyMuted>
								)}
							</div>
							<div className="ml-auto">
								{isOpen ? <ChevronDown size={24} /> : <ChevronLeft size={24} />}
							</div>
						</div>
					</CollapsibleTrigger>
				</div>
				<CollapsibleContent className="space-y-2 max-w-md">
					{isOpen && <TracksList playlistId={id} />}
				</CollapsibleContent>
			</Collapsible>
		</>
	);
};
