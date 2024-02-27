import { preloadQuery } from '@/lib/preload-query';
import { useAuthedMutation } from '@/lib/useAuthedMutation';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { usePreloadedQuery } from 'convex/react';
import { useEffect } from 'react';
import { api } from 'server';
import { Id } from 'server/functions/_generated/dataModel';
import { ListenersList } from './$radio/-components/listeners-list';

export const Route = createFileRoute('/app/$radio')({
	component: LayoutComponent,
	loader: async ({ params: { radio } }) => {
		const preloaded = await preloadQuery(api.rooms.get, {
			roomId: radio as Id<'rooms'>,
		}).catch(error => {
			console.log(`👨‍🚒`, error);
			/**
			 * If the room doesn't exist, redirect to the home page.
			 */
			throw redirect({ to: '/' });
		});

		return preloaded;
	},
});

function LayoutComponent() {
	const params = Route.useParams();
	const room = usePreloadedQuery(Route.useLoaderData());

	const addUserToRoom = useAuthedMutation(api.users.mutations.addUserToRoom);
	const removeUserFromRoom = useAuthedMutation(
		api.users.mutations.removeUserFromRoom,
	);
	useEffect(() => {
		addUserToRoom({
			roomId: params.radio as Id<'rooms'>,
		});
		return () => {
			removeUserFromRoom({
				roomId: params.radio as Id<'rooms'>,
			});
		};
	}, []);

	return (
		<>
			<div className="absolute top-6 left-6">
				<ListenersList listeners={room.details.listeners} />
			</div>
			<Outlet />
		</>
	);
}
