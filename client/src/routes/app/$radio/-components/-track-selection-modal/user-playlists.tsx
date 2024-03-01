import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetUserPlaylists } from '@/lib/providers/react-query/queries';
import { CollapsiblePlaylist } from '@/routes/app/$radio/-components/-track-selection-modal/collapsible-playlist';
import { UserProfile } from '@spotify/web-api-ts-sdk';

interface UserPlaylistsProps {
	userProfile: UserProfile;
}

export const UserPlaylists = ({ userProfile }: UserPlaylistsProps) => {
	const { data: playlists } = useGetUserPlaylists(userProfile.id);

	return (
		<ScrollArea className=" max-h-96 ">
			<ul className="space-y-2  contents">
				{playlists?.map(playlist => (
					<li key={playlist.id} className="mr-20">
						<CollapsiblePlaylist playlist={playlist} />
					</li>
				)) ?? []}
			</ul>
		</ScrollArea>
	);
};
