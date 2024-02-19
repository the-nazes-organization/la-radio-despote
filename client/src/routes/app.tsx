import { TypographyLarge, TypographyMuted } from '@/components/typography';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserDropdown } from '@/components/user-dropdown';
import { preloadQuery } from '@/lib/preload-query';
import { useSpotifyPlayerStore } from '@/lib/providers/SpotifyPlayerProvider';
import {
	Link,
	Outlet,
	createFileRoute,
	redirect,
} from '@tanstack/react-router';
import { usePreloadedQuery } from 'convex/react';
import { Home, Music } from 'lucide-react';
import { api } from 'server';

export const Route = createFileRoute('/app')({
	async beforeLoad(opts) {
		const store = useSpotifyPlayerStore.getState();
		const isAuthed = await store.sdk.getAccessToken();

		if (!isAuthed) {
			throw redirect({ to: '/login' });
		}
	},
	loader: () => {
		return preloadQuery(api.rooms.list, {});
	},
	component: LayoutComponent,
});

function LayoutComponent() {
	const rooms = usePreloadedQuery(Route.useLoaderData());

	return (
		<div className="grid grid-cols-[auto_1fr] gap-4 h-full p-4">
			<nav className="flex flex-col items-center py-4 space-y-3.5">
				<Link to="/app">
					<Home />
				</Link>

				<hr className="w-1/2" />

				{rooms.map(room => (
					<Tooltip key={room._id}>
						<TooltipTrigger>
							<Link
								key={room._id}
								to="/app/$radio"
								params={{ radio: room._id }}
							>
								<img
									src={room.playing.spotifyTrackData.album.images[0].url}
									alt={room.name}
									className="square-12 rounded"
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

			<div className="relative h-full">
				<div className="absolute top-6 right-6 space-x-4">
					<UserDropdown />
				</div>

				<Outlet />
			</div>
		</div>
	);
}
