import { useSpotifyPlayerStore } from '@/lib/providers/SpotifyPlayerProvider';
import { Route } from '@/routes/app/$radio';
import { useNavigate } from '@tanstack/react-router';
import { useQuery } from 'convex/react';
import { ListMusic, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from 'server';
import { Id } from 'server/functions/_generated/dataModel';
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from './command';

export function CommandMenu() {
	const [open, setOpen] = useState(false);
	const spotify = useSpotifyPlayerStore();
	const navigate = useNavigate();
	const params = Route.useParams();

	const query = useQuery(api.external.rooms.queries.get, {
		roomId: params.radio as Id<'rooms'>,
	});

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen(open => !open);
			}
		};
		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, []);

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<CommandInput placeholder="Select a command..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup
					heading={
						query?.details.name ? `Commandes de ${query.details.name}` : '$oom'
					}
				>
					<CommandItem>
						<ListMusic className="mr-2 square-4" />
						Add a track to the queue
					</CommandItem>
					<CommandItem
						onSelect={() => {
							spotify.sdk.logOut();
							navigate({ to: '/login' });
						}}
					>
						<LogOut className="mr-2 square-4" />
						Log out
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
