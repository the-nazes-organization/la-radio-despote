import { SpotifyAvatar } from '@/components/spotify-avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Users } from 'lucide-react';
import { Doc } from 'server/functions/_generated/dataModel';

interface ListenersListProps {
	listeners: Array<Doc<'users'>['spotifyUserProfile']>;
}

export const ListenersList = ({ listeners }: ListenersListProps) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" className="rounded-full">
					<Users />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				className="w-56"
				side="bottom"
				sideOffset={8}
				align="start"
			>
				{listeners.map(listener => {
					return (
						<DropdownMenuItem key={listener.id}>
							<div className="flex items-center space-x-2">
								<SpotifyAvatar spotifyUser={listener} />
								<span>{listener.display_name}</span>
							</div>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
