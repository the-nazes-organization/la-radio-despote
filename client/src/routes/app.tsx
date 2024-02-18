import { Navbar } from '@/components/navbar';
import { preloadQuery } from '@/lib/preload-query';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { usePreloadedQuery } from 'convex/react';
import { api } from 'server';

export const Route = createFileRoute('/app')({
	loader: () => preloadQuery(api.rooms.getRooms, {}),
	component: LayoutComponent,
});

function LayoutComponent() {
	const rooms = usePreloadedQuery(Route.useLoaderData());

	return (
		<>
			<Navbar rooms={rooms} />
			<Outlet />
		</>
	);
}
