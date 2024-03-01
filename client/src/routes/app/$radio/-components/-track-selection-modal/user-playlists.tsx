import { ScrollArea } from '@/components/ui/scroll-area';
import { useSpotifyPlayerStore } from '@/lib/providers/SpotifyPlayerProvider';
import { CollapsiblePlaylist } from '@/routes/app/$radio/-components/-track-selection-modal/collapsible-playlist';
import { SimplifiedPlaylist, UserProfile } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';

interface UserPlaylistsProps {
	userProfile: UserProfile;
}

export const UserPlaylists = ({ userProfile }: UserPlaylistsProps) => {
	const sdk = useSpotifyPlayerStore(store => store.sdk);
	const [playlists, setPlaylists] = useState<SimplifiedPlaylist[]>();

	useEffect(() => {
		if (userProfile) {
			const getPlaylists = async () => {
				const playlists = await sdk.currentUser.playlists.playlists();
				setPlaylists(playlists.items);
			};
			getPlaylists();
		}
	}, [sdk.currentUser.playlists, userProfile]);

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
