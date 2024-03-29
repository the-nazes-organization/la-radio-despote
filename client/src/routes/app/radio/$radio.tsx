import { ReactionsDisplay } from '@/components/reactions-display';
import { preloadQuery } from '@/lib/preload-query';
import { useAuthedMutation } from '@/lib/useAuthedMutation';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { usePreloadedQuery } from 'convex/react';
import { useEffect } from 'react';
import { api } from 'server';
import { Id } from 'server/functions/_generated/dataModel';
import { ListenersList } from './$radio/-components/listeners-list';

export const Route = createFileRoute('/app/radio/$radio')({
	component: LayoutComponent,
	loader: async ({ params: { radio } }) => {
		const preloaded = await preloadQuery(api.external.rooms.queries.get, {
			roomId: radio as Id<'rooms'>,
		}).catch(error => {
			/**
			 * If the room doesn't exist, redirect to the home page.
			 */
			throw redirect({ to: '/' });
		});

		return preloaded;
	},
});

function LayoutComponent() {
	const params = Route.useParams<{ radio: Id<'rooms'> }>();
	const room = usePreloadedQuery(Route.useLoaderData());

	const addUserToRoom = useAuthedMutation(
		api.external.users.mutations.addUserToRoom,
	);
	const removeUserFromRoom = useAuthedMutation(
		api.external.users.mutations.removeUserFromRoom,
	);
	useEffect(() => {
		addUserToRoom({
			roomId: params.radio,
		});
		return () => {
			removeUserFromRoom({
				roomId: params.radio,
			});
		};
	}, [addUserToRoom, params.radio, removeUserFromRoom]);

	return (
		<>
			<div className="absolute top-6 left-6">
				<ListenersList listeners={room.details.listeners} />
			</div>
			<ReactionsDisplay roomId={params.radio} />
			<Outlet />
		</>
	);
}
