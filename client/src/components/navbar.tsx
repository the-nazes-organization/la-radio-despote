import { Link } from '@tanstack/react-router';
import { FunctionReturnType } from 'convex/server';
import { Home, Music } from 'lucide-react';
import { api } from 'server';
import { TypographyLarge, TypographyMuted } from './typography';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface NavbarProps {
	rooms: FunctionReturnType<typeof api.external.rooms.queries.listRooms>;
}

export const Navbar = ({ rooms }: NavbarProps) => {
	return (
		<nav className="flex flex-col items-center py-4 space-y-3.5">
			<Link to="/app">
				<Home />
			</Link>

			<hr className="w-1/2" />

			{rooms.map(room => (
				<Tooltip key={room._id}>
					<TooltipTrigger>
						<Link key={room._id} to="/app/$radio" params={{ radio: room._id }}>
							<img
								src={room.playing.spotifyTrackData.album.images[0].url}
								alt={room.name}
								className="square-12 rounded min-w-12"
							/>
						</Link>
					</TooltipTrigger>

					<TooltipContent side="right">
						<TypographyLarge>{room.name}</TypographyLarge>

						<TypographyMuted>
							<Music className="square-[1em] inline-block mr-1" />
							{room.playing.spotifyTrackData.name} by{' '}
							{room.playing.spotifyTrackData.artists[0].name}
						</TypographyMuted>
					</TooltipContent>
				</Tooltip>
			))}
		</nav>
	);
};
