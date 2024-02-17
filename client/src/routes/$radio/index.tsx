import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from 'convex/react';
import { useEffect } from 'react';
import { api } from 'server';
import { useSpotifyPlayerStore } from '../../lib/providers/SpotifyPlayerProvider';

import { useSpotifyApiStore } from '@/lib/providers/SpotifyApiProvider';

export const Route = createFileRoute('/$radio/')({
	component: Radio,
});

function Radio() {
	const params = Route.useParams();
	const room = useQuery(api.rooms.getRoomById, {
		roomId: params.radio as any,
	});

	const player = useSpotifyPlayerStore();
	const { spotifyApi } = useSpotifyApiStore();

	useEffect(() => {
		if (player.deviceId && room) {
			spotifyApi.play({
				device_id: player.deviceId,
				uris: [`spotify:track:${room.tracks[0].spotifyId}`],
			});
		}
	}, [player.deviceId, room]);

	return (
		<div className="p-2">
			<h3>Welcome in the radio {params.radio}!</h3>

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
