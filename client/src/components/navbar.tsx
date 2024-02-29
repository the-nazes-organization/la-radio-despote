import { cn } from '@/lib/utils';
import { Route } from '@/routes/app/$radio';
import { Link } from '@tanstack/react-router';
import { FunctionReturnType } from 'convex/server';
import { Home, Music } from 'lucide-react';
import { api } from 'server';
import { Id } from 'server/functions/_generated/dataModel';
import { TypographyLarge, TypographyMuted } from './typography';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface NavbarProps extends React.HTMLProps<NavbarProps> {
	rooms: FunctionReturnType<typeof api.external.rooms.queries.listRooms>;
}

export const Navbar = ({ rooms, className }: NavbarProps) => {
	const params = Route.useParams<{ radio: Id<'rooms'> }>();

	return (
		<nav
			className={`hidden md:flex flex-col items-center py-4 space-y-3.5 ${className}`}
		>
			<Link
				to="/app"
				className={cn('p-2', !params.radio && 'bg-secondary rounded')}
			>
				<Home />
			</Link>

			<hr className="w-1/2" />

			{rooms.map(room => {
				const isActiveRadio = room._id === params.radio;

				return (
					<Tooltip key={room._id}>
						<TooltipTrigger
							className={cn('p-2', isActiveRadio && 'bg-secondary rounded')}
						>
							<Link
								key={room._id}
								to="/app/$radio"
								params={{ radio: room._id }}
							>
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
				);
			})}
		</nav>
	);
};
