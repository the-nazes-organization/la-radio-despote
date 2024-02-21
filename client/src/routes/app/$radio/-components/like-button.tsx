import { Button } from '@/components/ui/button';
import { useSpotifyPlayerStore } from '@/lib/providers/SpotifyPlayerProvider';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LikeButtonProps {}

export const LikeButton = ({}: LikeButtonProps) => {
	const player = useSpotifyPlayerStore();
	const [isLiked, setIsLiked] = useState(false);

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
	}, [player.state?.track_window.current_track]);

	const handleLike = async () => {
		if (currentTrack?.id) {
			isLiked
				? await player.sdk.currentUser.tracks.removeSavedTracks([
						currentTrack.id,
					])
				: await player.sdk.currentUser.tracks.saveTracks([currentTrack.id]);
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
