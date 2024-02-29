import { Link } from '@tanstack/react-router';
import { FunctionReturnType } from 'convex/server';
import { Home, Menu, Music, Users } from 'lucide-react';
import { api } from 'server';
import { TypographyH3, TypographyMuted, TypographySmall } from './typography';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

interface MobileSidebarProps {
	rooms: FunctionReturnType<typeof api.external.rooms.queries.listRooms>;
}

export const MobileSidebar = ({ rooms }: MobileSidebarProps) => {
	return (
		<Sheet>
			<SheetTrigger
				className={
					'transition hover:opacity-75 md:hidden self-start py-4 mx-auto flex'
				}
			>
				<Menu className=" text-white " />
			</SheetTrigger>
			<SheetContent side={'left'} className={'background p-4 py-12'}>
				<Link to="/app" className="flex items-center space-x-2">
					<Home /> <TypographyH3>Home</TypographyH3>
				</Link>
				<hr className="my-6" />
				<TypographyH3>Radios</TypographyH3>
				<ul className="space-y-3 pt-4">
					{rooms.map(room => (
						<Link
							key={room._id}
							to="/app/$radio"
							params={{ radio: room._id }}
							className="grid grid-cols-[40px_1fr_auto] gap-4"
						>
							<img
								src={room.playing.spotifyTrackData.album.images[0].url}
								alt={room.name}
								className="square-12 rounded min-w-12 self-center"
							/>
							<div className=" self-center">
								<TypographySmall className=" line-clamp-1">
									{room.name}
								</TypographySmall>

								<TypographyMuted className=" line-clamp-1">
									<Music className="square-[1em] inline-block mr-1" />
									{room.playing.spotifyTrackData.name} by{' '}
									{room.playing.spotifyTrackData.artists[0].name}
								</TypographyMuted>
							</div>
							<div className="flex self-center">
								<Users />
								{room.listeners.length}
							</div>
						</Link>
					))}
				</ul>
			</SheetContent>
		</Sheet>
	);
};
