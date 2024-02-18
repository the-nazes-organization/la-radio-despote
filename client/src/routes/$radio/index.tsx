import { preloadQuery } from '@/lib/preload-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { api } from 'server';
import { Id } from 'server/functions/_generated/dataModel';
import { useSpotifyPlayerStore } from '../../lib/providers/SpotifyPlayerProvider';
import { usePreloadedQuery } from 'convex/react';
import { TypographyH1 } from '@/components/typography';

export const Route = createFileRoute('/$radio/')({
	loader: ({ params: { radio } }) =>
		preloadQuery(api.rooms.getRoomById, { roomId: radio as Id<'rooms'> }),

	component: Radio,
});

function Radio() {
	const params = Route.useParams();

	const room = usePreloadedQuery(Route.useLoaderData());

	const player = useSpotifyPlayerStore();

	const playing = room?.tracks[0] ?? null;

	useEffect(() => {
		if (player.deviceId && playing) {
			player.actions.play({
				spotifyId: playing.spotifyTrackData!.spotifyId,
				startedAt: playing.playedAt!,
			});
		}

		return () => {
			player.player!.pause();
		};
	}, [player.deviceId, playing]);

	return (
		<div className="p-2">
			<TypographyH1>{room.room?.name}</TypographyH1>

			<pre>{JSON.stringify(room, null, 2)}</pre>

			<button
				onClick={async () => {
					console.log(await player.player!.getVolume());
				}}
			>
				play
			</button>
		</div>
	);
}
