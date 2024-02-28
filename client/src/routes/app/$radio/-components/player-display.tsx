import { TimeSlider } from '@/components/time-slider';
import { TypographyH3, TypographyMuted } from '@/components/typography';
import { useSpotifyPlayerStore } from '@/lib/providers/SpotifyPlayerProvider';
import { differenceInMilliseconds } from 'date-fns';
import { useEffect } from 'react';
import { Doc, Id } from 'server/functions/_generated/dataModel';
import { LikeButton } from './like-button';
import { NextTrackButton } from './next-track-button';

interface PlayerDisplayProps {
	playing: { spotifyTrackData: Doc<'spotifyTrackData'> } & Doc<'tracks'>;
	roomId: Id<'rooms'>;
}

export const PlayerDisplay = ({ playing }: PlayerDisplayProps) => {
	const player = useSpotifyPlayerStore();

	useEffect(() => {
		if (!player.deviceId || !playing.spotifyTrackData.spotifyId) {
			return;
		}
		const positionMs = differenceInMilliseconds(
			new Date(),
			new Date(playing.playedAt ?? Date.now()),
		);

		player.actions.play({
			spotifyId: playing.spotifyTrackData.spotifyId,
			positionMs,
		});

		return () => {
			player.player!.pause();
		};
	}, [
		player.actions,
		player.deviceId,
		player.player,
		playing.playedAt,
		playing.spotifyTrackData.spotifyId,
	]);

	return (
		<>
			<div className="flex items-center">
				<div className="flex flex-col items-center">
					<img
						className="square-[160px] tall:square-[260px] xtall:square-[350px] rounded-2xl mb-2"
						src={playing.spotifyTrackData.album.images[0]?.url}
					/>
					<TypographyH3 className="">
						{playing.spotifyTrackData.name}
					</TypographyH3>

					<TypographyMuted className="text-xs">
						{playing.spotifyTrackData.artists[0].name}
					</TypographyMuted>
				</div>
				<div className="pl-3 flex flex-col gap-2">
					<NextTrackButton />
					<LikeButton />
				</div>
			</div>
			<TimeSlider />
		</>
	);
};
