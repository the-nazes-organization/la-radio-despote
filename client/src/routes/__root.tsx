import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import ConvexClientProvider from '../lib/providers/ConvexProvider';
import '../main.css';
import { TooltipProvider } from '@/components/ui/tooltip';

export const Route = createRootRoute({
	component: () => {
		return (
			<ConvexClientProvider>
				<TooltipProvider delayDuration={0}>
					<Outlet />
					<TanStackRouterDevtools />
				</TooltipProvider>
			</ConvexClientProvider>
		);
	},
});
