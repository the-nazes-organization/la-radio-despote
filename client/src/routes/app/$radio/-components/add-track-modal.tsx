import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSpotifyPlayerStore } from '@/lib/providers/SpotifyPlayerProvider';
import { Music, Search } from 'lucide-react';
import React from 'react';
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

	return (
		<Dialog>
			<DialogTrigger asChild className={classname}>
				<Button className="md:space-x-2">
					<span className="hidden md:block">Add a track</span>
					<Music />+
				</Button>
			</DialogTrigger>
			<DialogContent className=" flex flex-col justify-start">
				<Tabs defaultValue="search" className=" ">
					<TabsList>
						<TabsTrigger value="search">
							Search
							<Search className="mx-2" />
						</TabsTrigger>
						<TabsTrigger value="playlists">
							My playlists <Music className="mx-2" />
						</TabsTrigger>
					</TabsList>
					<ScrollArea className="h-96">
						<TabsContent value="search" className="">
							<TrackSearch roomId={roomId} />
						</TabsContent>
						<TabsContent value="playlists" className="">
							{userProfile && <UserPlaylists userProfile={userProfile} />}
						</TabsContent>
					</ScrollArea>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
};
