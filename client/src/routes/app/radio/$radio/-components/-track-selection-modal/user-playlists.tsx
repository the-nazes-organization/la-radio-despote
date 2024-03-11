import { useGetUserPlaylists } from '@/lib/providers/react-query/queries';
import { UserProfile } from '@spotify/web-api-ts-sdk';
import { CollapsiblePlaylist } from './collapsible-playlist';
import { SavedTracks } from './saved-tracks';

interface UserPlaylistsProps {
	userProfile: UserProfile;
}

export const UserPlaylists = ({ userProfile }: UserPlaylistsProps) => {
	const { data: playlists } = useGetUserPlaylists(userProfile.id);

	return (
		<ul className="space-y-2 ">
			<SavedTracks />
			{playlists?.map(playlist => (
				<li key={playlist.id} className="mr-20">
					<CollapsiblePlaylist playlist={playlist} />
				</li>
			)) ?? []}
		</ul>
	);
};
