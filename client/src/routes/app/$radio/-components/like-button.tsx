import { Button } from '@/components/ui/button';
import { useSpotifyPlayerStore } from '@/lib/providers/SpotifyPlayerProvider';
import { useAuthedMutation } from '@/lib/useAuthedMutation';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from 'server';
import { Id } from 'server/functions/_generated/dataModel';

interface LikeButtonProps {
	roomId: Id<'rooms'>;
}

export const LikeButton = ({ roomId }: LikeButtonProps) => {
	const player = useSpotifyPlayerStore();
	const [isLiked, setIsLiked] = useState(false);
	const addLikeReaction = useAuthedMutation(
		api.external.reactions.mutations.addLikeReaction,
	);

	const currentTrack = player.state?.track_window.current_track;

	useEffect(() => {
		if (!player.state?.track_window.current_track) return;
		const fetchLiked = async () => {
			if (currentTrack?.id) {
				const [isLiked] = await player.sdk.currentUser.tracks.hasSavedTracks([
					currentTrack.id,
				]);
				setIsLiked(isLiked);
			}
		};
		fetchLiked();
	}, [
		currentTrack,
		player.sdk.currentUser.tracks,
		player.state?.track_window.current_track,
	]);

	const handleLike = async () => {
		if (currentTrack?.id) {
			if (!isLiked) {
				await player.sdk.currentUser.tracks.saveTracks([currentTrack.id]);
				addLikeReaction({ roomId });
			} else {
				await player.sdk.currentUser.tracks.removeSavedTracks([
					currentTrack.id,
				]);
			}
			setIsLiked(!isLiked);
		}
	};

	return (
		<Button variant="outline" size="icon" className="rounded-full">
			<Heart
				onClick={handleLike}
				className={cn(isLiked ? 'fill-red-500 text-red-500' : 'fill-white')}
			/>
		</Button>
	);
};
