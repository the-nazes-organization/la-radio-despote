import { Track } from '@spotify/web-api-ts-sdk';
import { Doc } from 'server/functions/_generated/dataModel';
import { TypographyMuted } from './typography';

interface TrackDisplayProps {
	track: Track | Doc<'spotifyTrackData'> | null;
}

export const TrackDisplay = ({ track }: TrackDisplayProps) => {
	if (!track) return null;
	return (
		<div className="grid grid-cols-[40px_1fr] gap-4 grow">
			<img
				src={track.album.images[2].url}
				className="rounded-md place-self-center"
			/>

			<div>
				<div className="text-sm">{track.name}</div>
				<TypographyMuted className="text-xs">
					{track.artists[0].name}
				</TypographyMuted>
			</div>
		</div>
	);
};
