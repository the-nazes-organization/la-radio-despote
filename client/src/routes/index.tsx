import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from 'convex/react';

import { api } from 'server';

export const Route = createFileRoute('/')({
	component: Index,
});

function Index() {
	const rooms = useQuery(api.rooms.getRooms);

	return (
		<div className="p-2">
			<h3>Welcome Home!</h3>
			{rooms?.map(room => (
				<div key={room.room_id} className="p-2 border rounded">
					<h4>{room.room_name}</h4>
					<p>{room._creationTime}</p>

					<div className="flex gap-2">
						<button className="bg-blue-500 text-white rounded p-2">Join</button>
						<button className="bg-red-500 text-white rounded p-2">Leave</button>
					</div>
				</div>
			))}
		</div>
	);
}
