import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronLeft, Heart } from 'lucide-react';
import React from 'react';
import { TracksList } from './tracks-list';

export const SavedTracks = () => {
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<div className={cn('sticky top-0 bg-background', isOpen && 'py-2')}>
				<CollapsibleTrigger asChild>
					<div className="grid grid-cols-[40px_auto_20px] gap-4 max-w-md">
						<div className="size-10 bg-gradient-to-br from-indigo-500 to-white rounded flex items-center justify-center">
							<Heart className="fill-white" />
						</div>

						<div className="shrink self-center">
							<div className="text-sm line-clamp-1">Saved tracks</div>
						</div>
						<div className="ml-auto">
							{isOpen ? <ChevronDown size={24} /> : <ChevronLeft size={24} />}
						</div>
					</div>
				</CollapsibleTrigger>
			</div>
			<CollapsibleContent className="space-y-2 max-w-md">
				{isOpen && <TracksList playlistId={'savedTracks'} />}
			</CollapsibleContent>
		</Collapsible>
	);
};
