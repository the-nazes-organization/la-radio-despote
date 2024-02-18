import { TypographyH1 } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { preloadQuery } from '@/lib/preload-query';
import { createFileRoute } from '@tanstack/react-router';
import { useAction, usePreloadedQuery } from 'convex/react';
import { useEffect } from 'react';
import { api } from 'server';
import { Id } from 'server/functions/_generated/dataModel';
import { useSpotifyPlayerStore } from '../../../lib/providers/SpotifyPlayerProvider';

export const Route = createFileRoute('/app/$radio/')({
	loader: ({ params: { radio } }) =>
		preloadQuery(api.rooms.get, { roomId: radio as Id<'rooms'> }),

	component: Radio,
});

function Radio() {
	const params = Route.useParams();

	const room = usePreloadedQuery(Route.useLoaderData());

	const player = useSpotifyPlayerStore();

	const requestTrack = useAction(api.tracksActions.requestTrack);

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

			<Button
				onClick={async () => {
					requestTrack({
						spotifyTrackId: '5EW0i7UltRvODlUXWOVE7l',
						roomId: params.radio as Id<'rooms'>,
					}).then(d => console.log('✅', d));
				}}
			>
				play
			</Button>
		</div>
	);
}
