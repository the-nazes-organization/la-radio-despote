import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useSpotifyPlayerStore } from '@/lib/providers/SpotifyPlayerProvider';
import { cn } from '@/lib/utils';
import { Music, Search } from 'lucide-react';
import React, { useState } from 'react';
import { Id } from 'server/functions/_generated/dataModel';
import { TrackSearch } from './-track-selection-modal/track-search';
import { UserPlaylists } from './-track-selection-modal/user-playlists';

interface AddTrackModalButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	roomId: Id<'rooms'>;
	classname?: string;
}

export const AddTrackModalButton = ({
	roomId,
	classname,
}: AddTrackModalButtonProps) => {
	const userProfile = useSpotifyPlayerStore(store => store.userProfile);

	const [tab, setTab] = useState<'search' | 'playlists'>('playlists');

	return (
		<Dialog defaultOpen={true}>
			<DialogTrigger asChild className={classname}>
				<Button className="md:space-x-2">
					<span className="hidden md:block">Add a track</span>
					<Music />+
				</Button>
			</DialogTrigger>
			<DialogContent className=" h-96 flex flex-col justify-start">
				<DialogHeader>
					<DialogTitle className="space-x-2 flex w-full">
						<span
							onClick={() => setTab('search')}
							className={cn(
								'cursor-pointer font-thin flex items-center',
								tab === 'search' && 'text-blue-500 font-bold',
							)}
						>
							<Search className="mx-2" /> Search for a track
						</span>
						<span>|</span>
						<span
							onClick={() => setTab('playlists')}
							className={cn(
								'cursor-pointer font-thin flex items-center ',
								tab === 'playlists' && 'text-blue-500 font-bold',
							)}
						>
							My playlists <Music className="mx-2" />
						</span>
					</DialogTitle>
				</DialogHeader>
				{tab === 'search' && <TrackSearch roomId={roomId} />}
				{tab === 'playlists' && userProfile && (
					<UserPlaylists userProfile={userProfile} />
				)}
			</DialogContent>
		</Dialog>
	);
};
