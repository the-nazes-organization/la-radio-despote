import { SpotifyAvatar } from '@/components/spotify-avatar';
import {
	AvatarGroup,
	AvatarGroupList,
	AvatarOverflowIndicator,
} from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Doc } from 'server/functions/_generated/dataModel';

interface ListenersListProps {
	listeners: Array<Doc<'users'>['spotifyUserProfile']>;
}

export const ListenersList = ({ listeners }: ListenersListProps) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<AvatarGroup limit={3}>
					<AvatarGroupList>
						{listeners.map((listener, index) => {
							return (
								<div key={listener.id + index}>
									<SpotifyAvatar spotifyUser={listener} />
								</div>
							);
						})}
					</AvatarGroupList>
					<AvatarOverflowIndicator />
				</AvatarGroup>
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
