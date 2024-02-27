import {
	TypographyH1,
	TypographyH3,
	TypographyLarge,
	TypographyMuted,
} from '@/components/typography';
import { Button } from '@/components/ui/button';
import { preloadQuery } from '@/lib/preload-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useMutation, usePreloadedQuery } from 'convex/react';

import { AddTrackButton } from '@/components/add-track-button';
import { AddTrackModal } from '@/components/add-track-modal';
import { TimeSlider } from '@/components/time-slider';
import { CommandMenu } from '@/components/ui/command-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSpotifyPlayerStore } from '@/lib/providers/SpotifyPlayerProvider';
import { useAuthedAction } from '@/lib/useAuthedAction';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { api } from 'server';
import { Id } from 'server/functions/_generated/dataModel';
import { LikeButton } from './-components/like-button';
import { NextTrackButton } from './-components/next-track-button';

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
	const params = Route.useParams<{ radio: Id<'rooms'> }>();

	const room = usePreloadedQuery(Route.useLoaderData());

	const player = useSpotifyPlayerStore();

	const removeTrack = useMutation(api.tracks.removeTrack);

	const requestTrack = useAuthedAction(api.tracksActions.requestTrack);

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
			<CommandMenu />

			<TypographyH1 className="mb-12">{room.details.name}</TypographyH1>

			<section>
				<div className="flex items-center">
					<div className="flex flex-col items-center">
						<img
							className="square-[160px] tall:square-[260px] xtall:square-[350px] rounded-2xl mb-2"
							src={room.playing.spotifyTrackData.album.images[0]?.url}
						/>
						<TypographyH3 className="">
							{room.playing.spotifyTrackData.name}
						</TypographyH3>

						<TypographyMuted className="text-xs">
							{room.playing.spotifyTrackData.artists[0].name}
						</TypographyMuted>
					</div>
					<div className="pl-3 flex flex-col gap-2">
						<NextTrackButton />
						<LikeButton />
					</div>
				</div>
				<TimeSlider />
			</section>

			<section className="w-full md:max-w-xl">
				<TypographyH3 className="mb-3 flex justify-between">
					<span>Playing Next</span>

					<AddTrackModal roomId={params.radio} />
				</TypographyH3>

				<hr />

				<ScrollArea className="h-[360px] pr-4">
					<ul className="space-y-3 pt-4">
						{room.queue
							.filter(track => !track.playedAt)
							.map(track => (
								<li
									key={track._id}
									className=" flex items-center group transition ease-in-out duration-500"
								>
									<div className="grid grid-cols-[40px_1fr] gap-4">
										<img
											src={
												track.spotifyTrackData.album.images[2]?.url // TODO: Sometimes the images are not available
											}
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
										className="ml-auto hidden group-hover:flex rounded-full size-6 text-red-600 hover:bg-red-500 hover:text-white"
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
						Recommendations
					</TypographyLarge>

					<ul className="space-y-3">
						{room.recommendations?.map(track =>
							track ? (
								<li
									key={track!._id}
									className=" flex items-center group transition ease-in-out duration-500"
								>
									<div className="grid grid-cols-[40px_1fr] gap-4">
										<img
											src={track!.album.images[2]?.url} // TODO: Sometimes the images are not available
											className="rounded-md"
										/>
										<div>
											<div className="text-sm">{track!.name}</div>
											<TypographyMuted className="text-xs">
												{track!.artists[0].name}
											</TypographyMuted>
										</div>
									</div>
									<div className="ml-auto hidden group-hover:flex rounded-full">
										<AddTrackButton
											spotifyTrackId={track.spotifyId}
											roomId={params.radio}
										/>
									</div>
								</li>
							) : null,
						)}
					</ul>
				</ScrollArea>
			</section>
		</div>
	);
}
