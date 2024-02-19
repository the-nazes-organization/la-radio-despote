import {
	TypographyH1,
	TypographyH2,
	TypographyH3,
	TypographyMuted,
} from '@/components/typography';
import { Button } from '@/components/ui/button';
import { preloadQuery } from '@/lib/preload-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useMutation, usePreloadedQuery } from 'convex/react';

import { TrackSearch } from '@/components/track-search';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { api } from 'server';
import { Id } from 'server/functions/_generated/dataModel';
import { useSpotifyPlayerStore } from '../../../lib/providers/SpotifyPlayerProvider';

export const Route = createFileRoute('/app/$radio/')({
	loader: async ({ params: { radio } }) => {
		const preloaded = await preloadQuery(api.rooms.get, {
			roomId: radio as Id<'rooms'>,
		}).catch(error => {
			/**
			 * If the room doesn't exist, redirect to the home page.
			 */
			throw redirect({ to: '/' });
		});

		return preloaded;
	},

	component: Radio,
});

function Radio() {
	const params = Route.useParams();

	const room = usePreloadedQuery(Route.useLoaderData());

	const player = useSpotifyPlayerStore();

	const removeTrack = useMutation(api.tracks.removeTrack);

	useEffect(() => {
		if (player.deviceId && room.playing) {
			player.actions.play({
				spotifyId: room.playing.spotifyTrackData!.spotifyId,
				startedAt: room.playing.playedAt!,
			});
		}

		return () => {
			player.player!.pause();
		};
	}, [player.deviceId, room.playing]);

	return (
		<div className="p-8 space-y-8">
			<TypographyH1 className="mb-12">{room.details.name}</TypographyH1>

			<div className="">
				<img
					className="square-[280px] rounded-2xl mb-1"
					src={room.playing.spotifyTrackData.album.images[0].url}
				/>

				<TypographyH3 className="">
					{room.playing.spotifyTrackData.name}
				</TypographyH3>

				<TypographyMuted className="text-xs">
					{room.playing.spotifyTrackData.artists[0].name}
				</TypographyMuted>
			</div>

			<section>
				<TypographyH2 className="mb-4">Liste d'attente</TypographyH2>

				<ul className="space-y-3">
					{room.tracks
						.filter(track => !track.playedAt)
						.map(track => (
							<li
								key={track._id}
								className=" flex items-center group transition ease-in-out duration-500"
							>
								<div className="grid grid-cols-[40px_1fr] gap-4">
									<img
										src={track.spotifyTrackData.album.images[2].url}
										className="rounded-md"
									/>
									<div>
										<div className="text-sm">{track.spotifyTrackData.name}</div>
										<TypographyMuted className="text-xs">
											{track.spotifyTrackData.artists[0].name}
										</TypographyMuted>
									</div>
								</div>
								<Button
									className="ml-auto hidden group-hover:flex   "
									size={'icon'}
									variant={'outline'}
								>
									<X
										onClick={async () => {
											removeTrack({
												trackId: track._id,
											});
										}}
									/>
								</Button>
							</li>
						))}
				</ul>
			</section>

			<TrackSearch roomId={params.radio as Id<'rooms'>} />

			<section>
				<TypographyH2 className="mb-4">Historique</TypographyH2>

				<ul className="space-y-3">
					{room.tracks
						.filter(track => !!track.playedAt)
						.map(track => (
							<li key={track._id} className="grid grid-cols-[40px_1fr] gap-4">
								<img
									src={track.spotifyTrackData.album.images[2].url}
									className="rounded-md"
								/>

								<div>
									<div className="text-sm">{track.spotifyTrackData.name}</div>
									<TypographyMuted className="text-xs">
										{track.spotifyTrackData.artists[0].name}
									</TypographyMuted>
								</div>
							</li>
						))}
				</ul>
			</section>
		</div>
	);
}
