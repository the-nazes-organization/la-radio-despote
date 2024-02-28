import { Button } from '@/components/ui/button';
import { useSpotifyPlayerStore } from '@/lib/providers/SpotifyPlayerProvider';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

const heart = confetti.shapeFromPath({
	path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
});

export const LikeButton = () => {
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
	}, [
		currentTrack,
		player.sdk.currentUser.tracks,
		player.state?.track_window.current_track,
	]);

	const handleLike = async () => {
		if (currentTrack?.id) {
			if (!isLiked) {
				await player.sdk.currentUser.tracks.saveTracks([currentTrack.id]);

				confetti({
					particleCount: 100,
					spread: 70,
					origin: { y: 1 },
					shapes: [heart],
					colors: ['#f93963', '#a10864', '#ee0b93'],
				});
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
