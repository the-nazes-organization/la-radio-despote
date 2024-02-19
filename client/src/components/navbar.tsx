import { Link } from '@tanstack/react-router';
import { FunctionReturnType } from 'convex/server';
import { Headphones } from 'lucide-react';

interface NavbarProps {
	rooms: FunctionReturnType<typeof import('server').api.rooms.list>;
}

export const Navbar = ({ rooms }: NavbarProps) => {
	return (
		<nav className="">
			<Link to="/" className="[&.active]:font-bold">
				Home
			</Link>

			{rooms.map(room => (
				<Link
					key={room._id}
					to="/app/$radio"
					params={{
						radio: room._id,
					}}
				>
					<div className="rounded">
						<div className="w-full flex items-center gap-x-2">
							<div className=" w-12 h-12 rounded-md bg-gradient-to-br from-sky-400 to-purple-600 flex items-center justify-center text-white">
								<Headphones />
							</div>

							<h4 className="text-xs">
								<p>{room.name}</p>
								<span>Number of listeners</span>
							</h4>
						</div>
					</div>
				</Link>
			))}
		</nav>
	);
};
