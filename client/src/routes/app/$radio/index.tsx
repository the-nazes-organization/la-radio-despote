import {
	TypographyH1,
	TypographyH3,
	TypographyH4,
	TypographyLarge,
	TypographyMuted,
} from '@/components/typography';
import { Button } from '@/components/ui/button';
import { preloadQuery } from '@/lib/preload-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAction, useMutation, usePreloadedQuery } from 'convex/react';

import { AddTrackButton } from '@/components/add-track-button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, X } from 'lucide-react';
import { useEffect } from 'react';
import { api } from 'server';
import { Id } from 'server/functions/_generated/dataModel';
import { useSpotifyPlayerStore } from '../../../lib/providers/SpotifyPlayerProvider';

export const Route = createFileRoute('/app/$radio/')({
	loader: async ({ params: { radio } }) => {
		const preloaded = await preloadQuery(api.rooms.get, {
			roomId: radio as Id<'rooms'>,
		}).catch(error => {
			console.log(`👨‍🚒`, error);
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

	const requestTrack = useAction(api.tracksActions.requestTrack);

	useEffect(() => {
		if (player.deviceId && room.playing) {
			player.actions.play({
				spotifyId: room.playing.spotifyTrackData.spotifyId,
				playedAt: room.playing.playedAt!,
			});
		}

		return () => {
			player.player!.pause();
		};
	}, [player.deviceId, room.playing]);

	return (
		<div className="p-6 border rounded-md h-full flex flex-col justify-between items-center">
			<TypographyH1 className="mb-12">{room.details.name}</TypographyH1>

			<section className="">
				<img
					className="square-[160px] tall:square-[260px] rounded-2xl mb-2"
					src={room.playing.spotifyTrackData.album.images[0].url}
				/>

				<TypographyH3 className="mb-1">
					{room.playing.spotifyTrackData.name}
				</TypographyH3>

				<TypographyMuted className="text-xs">
					{room.playing.spotifyTrackData.artists[0].name}
				</TypographyMuted>
			</section>

			<section>
				<TypographyH3 className="mb-4 flex justify-between">
					<span>Liste d'attente</span>

					<AddTrackButton roomId={params.radio as Id<'rooms'>} />
				</TypographyH3>

				<ScrollArea className="w-[600px] h-[360px]">
					<ul className="space-y-3">
						{room.queue
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
											<div className="text-sm">
												{track.spotifyTrackData.name}
											</div>
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

					<TypographyLarge className="mt-8 mb-4 flex">
						Recommandations
					</TypographyLarge>

					<ul className="space-y-3">
						{room.recommendations?.map(track => (
							<li
								key={track!._id}
								className=" flex items-center group transition ease-in-out duration-500"
							>
								<div className="grid grid-cols-[40px_1fr] gap-4">
									<img
										src={track!.album.images[2].url}
										className="rounded-md"
									/>
									<div>
										<div className="text-sm">{track!.name}</div>
										<TypographyMuted className="text-xs">
											{track!.artists[0].name}
										</TypographyMuted>
									</div>
								</div>
								<Button
									className="ml-auto hidden group-hover:flex   "
									size={'icon'}
									variant={'outline'}
								>
									<Plus
										onClick={async () => {
											requestTrack({
												spotifyTrackId: track!.spotifyId,
												roomId: room.details._id,
											});
										}}
									/>
								</Button>
							</li>
						))}
					</ul>
				</ScrollArea>
			</section>
		</div>
	);
}
