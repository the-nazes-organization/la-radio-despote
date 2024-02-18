import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import ConvexClientProvider from '../lib/providers/ConvexProvider';
import '../main.css';
import { useSpotifyPlayerStore } from '@/lib/providers/SpotifyPlayerProvider';

export const Route = createRootRoute({
	component: () => {
		const player = useSpotifyPlayerStore();

		return (
			<ConvexClientProvider>
				<div className="p-2 flex gap-2">
					<Link to="/" className="[&.active]:font-bold">
						Home
					</Link>{' '}
					<Link to="/about" className="[&.active]:font-bold">
						About
					</Link>
				</div>
				<hr />
				<Outlet />
				<TanStackRouterDevtools />

				<div className="absolute bottom-4 right-4">{/* {player.state} */}</div>
			</ConvexClientProvider>
		);
	},
});
