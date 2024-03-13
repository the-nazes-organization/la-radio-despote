import { Doc } from 'server/functions/_generated/dataModel';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface SpotifyAvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
	spotifyUser: Doc<'users'>['spotifyUserProfile'];
	variant?: 'small' | 'large';
}

const getAvatarFallbackName = (listener: Doc<'users'>['spotifyUserProfile']) =>
	listener.display_name
		.split(' ')
		.map(w => w[0])
		.join('');

export const SpotifyAvatar = ({
	spotifyUser,
	className,
	variant = 'small',
}: SpotifyAvatarProps) => {
	const avatarFallbackName = getAvatarFallbackName(spotifyUser);

	return (
		<Avatar className={className}>
			<AvatarImage
				src={
					variant === 'small'
						? spotifyUser.images[0].url
						: spotifyUser.images[1].url
				}
			/>
			<AvatarFallback>{avatarFallbackName}</AvatarFallback>
		</Avatar>
	);
};
