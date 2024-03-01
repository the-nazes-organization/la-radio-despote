import {
	TypographyH1,
	TypographyH3,
	TypographyLarge,
	TypographyMuted,
} from '@/components/typography';
import { Button } from '@/components/ui/button';
import { preloadQuery } from '@/lib/preload-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { usePreloadedQuery } from 'convex/react';

import { AddTrackButton } from '@/components/add-track-button';
import { SpotifyAvatar } from '@/components/spotify-avatar';
import { CommandMenu } from '@/components/ui/command-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthedMutation } from '@/lib/useAuthedMutation';
import { X } from 'lucide-react';
import { api } from 'server';
import { Id } from 'server/functions/_generated/dataModel';
import { AddTrackModalButton } from './-components/add-track-modal';
import { PlayerDisplay } from './-components/player-display';

export const Route = createFileRoute('/app/$radio/')({
	loader: async ({ params: { radio } }) => {
		const preloaded = await preloadQuery(api.external.rooms.queries.get, {
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

	const { details, playing, queue, recommendations } = usePreloadedQuery(
		Route.useLoaderData(),
	);

	const removeTrack = useAuthedMutation(
		api.external.rooms.mutations.removeTrackFromQueue,
	);

	return (
		<div className="p-6 border rounded-md h-full flex flex-col justify-between items-center">
			<CommandMenu />

			<TypographyH1 className="mb-12">{details.name}</TypographyH1>

			<section>
				<PlayerDisplay playing={playing} roomId={params.radio} />
			</section>

			<section className="w-full md:max-w-xl">
				<TypographyH3 className="mb-3 flex justify-between">
					<span>Playing Next</span>

					<AddTrackModalButton roomId={params.radio} />
				</TypographyH3>

				<hr />

				<ScrollArea className="h-[360px] pr-4">
					<ul className="space-y-3 pt-4">
						{queue
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
									<div className="ml-auto flex space-x-2  items-center">
										{track.askedBy && (
											<SpotifyAvatar
												spotifyUser={track.askedBy.spotifyUserProfile}
											/>
										)}
										<Button
											className="rounded-full size-6 text-red-600 hover:bg-red-500 hover:text-white"
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
									</div>
								</li>
							))}
					</ul>

					<TypographyLarge className="mt-8 mb-4 flex">
						Recommendations
					</TypographyLarge>

					<ul className="space-y-3">
						{recommendations?.map(track =>
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
