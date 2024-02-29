import { Doc } from 'server/functions/_generated/dataModel';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface SpotifyAvatarProps {
	spotifyUser: Doc<'users'>['spotifyUserProfile'];
}

const getAvatarFallbackName = (listener: Doc<'users'>['spotifyUserProfile']) =>
	listener.display_name
		.split(' ')
		.map(w => w[0])
		.join('');

export const SpotifyAvatar = ({ spotifyUser }: SpotifyAvatarProps) => {
	const avatarFallbackName = getAvatarFallbackName(spotifyUser);

	return (
		<Avatar>
			<AvatarImage
				src={spotifyUser.images[0].url ?? spotifyUser.images[1].url}
			/>
			<AvatarFallback>{avatarFallbackName}</AvatarFallback>
		</Avatar>
	);
};
