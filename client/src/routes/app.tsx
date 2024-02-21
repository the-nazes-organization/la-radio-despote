import { Navbar } from '@/components/navbar';
import { UserDropdown } from '@/components/user-dropdown';
import { preloadQuery } from '@/lib/preload-query';
import { useSpotifyPlayerStore } from '@/lib/providers/SpotifyPlayerProvider';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { usePreloadedQuery } from 'convex/react';
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
			<Navbar rooms={rooms} />
			<div className="relative h-full">
				<div className="absolute top-6 right-6 space-x-4">
					<UserDropdown />
				</div>

				<Outlet />
			</div>
		</div>
	);
}
