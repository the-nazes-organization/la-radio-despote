import { useSpotifyPlayerStore } from '@/lib/providers/SpotifyPlayerProvider';
import { useEffect, useState } from 'react';
import { Slider } from './ui/slider';

export const TimeSlider = () => {
	const player = useSpotifyPlayerStore();

	const [position, setPosition] = useState<number>(0);

	useEffect(() => {
		const playingInterval = setInterval(async () => {
			const state = await player.player?.getCurrentState();
			const pourcentage =
				state?.position && state.duration
					? (state?.position / state?.duration) * 100
					: 0;
			setPosition(pourcentage);
		}, 1000);
		return () => {
			clearInterval(playingInterval);
		};
	}, [player.player]);

	return (
		<div className="w-full">
			<Slider
				value={[position]}
				max={100}
				step={1}
				draggable={false}
				classNameThumb={'hidden'}
			/>
		</div>
	);
};
