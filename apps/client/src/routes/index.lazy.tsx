import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const Route = createLazyFileRoute("/")({
	component: Index,
});

function Index() {
	const rooms = useQuery(api.rooms.get);
	return (
		<div className="p-2">
			<h3>Welcome Home!</h3>
			{rooms.data.map((room) => (
				<div key={room.id} className="p-2 border rounded">
					<h4>{room.name}</h4>
					<p>{room.description}</p>

					<div className="flex gap-2">
						<button className="bg-blue-500 text-white rounded p-2">Join</button>
						<button className="bg-red-500 text-white rounded p-2">Leave</button>
					</div>
				</div>
			))}
		</div>
	);
}
