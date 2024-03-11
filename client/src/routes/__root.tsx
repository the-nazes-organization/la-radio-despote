import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryProvider } from '@/lib/providers/react-query/QueryProvider';
import { ThemeProvider } from '@/lib/providers/ThemeProvider';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import ConvexClientProvider from '../lib/providers/ConvexProvider';
import '../main.css';

export const Route = createRootRoute({
	component: () => {
		return (
			<ConvexClientProvider>
				<QueryProvider>
					<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
						<TooltipProvider delayDuration={0}>
							<Toaster />

							<Outlet />
						</TooltipProvider>
					</ThemeProvider>
				</QueryProvider>
			</ConvexClientProvider>
		);
	},
});
