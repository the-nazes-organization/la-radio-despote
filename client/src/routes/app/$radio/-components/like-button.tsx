import { Button } from '@/components/ui/button';
import { useSpotifyPlayerStore } from '@/lib/providers/SpotifyPlayerProvider';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LikeButtonProps {}

export const LikeButton = ({}: LikeButtonProps) => {
	const player = useSpotifyPlayerStore();
	const [isLiked, setIsLiked] = useState(false);

	useEffect(() => {
		if (!player.state?.track_window.current_track) return;
		const fetchLiked = async () => {
			const [res] = (await player.sdk.makeRequest(
				'GET',
				`me/tracks/contains?ids=${player.state?.track_window.current_track.id}`,
			)) as [boolean];
			setIsLiked(res);
		};
		fetchLiked();
	}, [player.state?.track_window.current_track]);

	const handleLike = async () => {
		await player.sdk.makeRequest(
			isLiked ? 'DELETE' : 'PUT',
			`me/tracks?ids=${player.state?.track_window.current_track.id}`,
		);
		setIsLiked(!isLiked);
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
