import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import ConvexClientProvider from '../lib/providers/ConvexProvider';
import '../main.css';

export const Route = createRootRoute({
	component: () => {
		return (
			<ConvexClientProvider>
				<div className="flex gap-4">
					<Outlet />
				</div>
				<TanStackRouterDevtools />
				<div className="absolute bottom-4 right-4">{/* {player.state} */}</div>
			</ConvexClientProvider>
		);
	},
});
