import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClientProviderComponent } from '@/lib/providers/QueryClientProvider';
import { ThemeProvider } from '@/lib/providers/ThemeProvider';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import ConvexClientProvider from '../lib/providers/ConvexProvider';
import '../main.css';

export const Route = createRootRoute({
	component: () => {
		return (
			<ConvexClientProvider>
				<QueryClientProviderComponent>
					<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
						<TooltipProvider delayDuration={0}>
							<Outlet />
						</TooltipProvider>
					</ThemeProvider>
				</QueryClientProviderComponent>
			</ConvexClientProvider>
		);
	},
});
