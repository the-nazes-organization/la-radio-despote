import { preloadQuery } from '@/lib/preload-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { usePreloadedQuery } from 'convex/react';

import { api } from 'server';

export const Route = createFileRoute('/')({
	loader: () => preloadQuery(api.rooms.getRooms, {}),
	component: Index,
});

function Index() {
	const rooms = usePreloadedQuery(Route.useLoaderData());

	return (
		<div className="p-2">
			<h3 className="font-normal">Welcome Home!</h3>

			{rooms.map(room => (
				<div key={room._id} className="p-2 border rounded">
					<h4 className="font-bold">{room.name}</h4>

					<div className="flex gap-2">
						<Link
							to="/$radio"
							params={{
								radio: room._id,
							}}
							className="bg-blue-500 text-white rounded p-2"
						>
							Join
						</Link>
					</div>
				</div>
			))}
		</div>
	);
}
