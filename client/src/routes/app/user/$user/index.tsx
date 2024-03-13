import { SpotifyAvatar } from '@/components/spotify-avatar';
import { TrackDisplay } from '@/components/track-display';
import { TypographyH1, TypographyMuted } from '@/components/typography';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { preloadQuery } from '@/lib/preload-query';
import { User } from '@spotify/web-api-ts-sdk';
import { createFileRoute } from '@tanstack/react-router';
import { usePreloadedQuery } from 'convex/react';
import { Heart } from 'lucide-react';
import { api } from 'server';
import { Doc } from 'server/functions/_generated/dataModel';
import { SquareTrackCard } from './-components/square-track-card';

export interface SquareTrackCardProps {
	track: Doc<'spotifyTrackData'>;
	radio?: Doc<'rooms'> | null;
}

export const Route = createFileRoute('/app/user/$user/')({
	loader: async ({ params: { user } }) => {
		const userProfile = await preloadQuery(api.external.users.queries.getUser, {
			spotifyUserId: user as User['id'],
		});
		// .catch(error => {
		// 	throw redirect({ to: '/' });
		// });

		return userProfile;
	},

	component: UserProfile,
});

function UserProfile() {
	const {
		userProfile,
		recentlyAskedTracks,
		tracksLikedByUser,
		tracksLikedByOthers,
	} = usePreloadedQuery(Route.useLoaderData());

	return (
		<div className="p-6 border rounded-md h-full flex flex-col items-center">
			<TypographyH1 className="mb-12">User Profile</TypographyH1>
			<section className="flex ">
				{userProfile && (
					<SpotifyAvatar
						spotifyUser={userProfile?.spotifyUserProfile}
						variant="large"
						className="size-32 place-self-center"
					/>
				)}
				<TypographyH1 className="place-self-center">
					{userProfile?.spotifyUserProfile.display_name}
				</TypographyH1>
			</section>
			<div className={'grid grid-cols-2 gap-4 grid-rows-2 h-full'}>
				<section className="w-full grow	h-full flex flex-col">
					<h2 className="text-2xl font-semibold tracking-tight">
						Recently asked songs
					</h2>
					<TypographyMuted>The last songs asked</TypographyMuted>
					<Separator />
					<ScrollArea className="py-4 grow">
						<div className="gap-x-4 flex">
							{recentlyAskedTracks.map(track =>
								track?.spotifyTrackData ? (
									<SquareTrackCard
										key={track._id}
										track={track.spotifyTrackData}
										radio={track.room}
									/>
								) : null,
							)}
						</div>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</section>
				<section className=" row-span-2">
					<h2 className="text-2xl font-semibold tracking-tight">
						Liked proposals
					</h2>
					<TypographyMuted>Asked tracks liked by others</TypographyMuted>
					<Separator />
					<ul className="p-2 space-y-2 ">
						{tracksLikedByOthers.map(track =>
							track ? (
								<li key={track._id} className=" flex items-center">
									<TrackDisplay track={track} />
									{track.likes}
									<Heart className="mx-2" />
								</li>
							) : null,
						)}
					</ul>
				</section>
				<section className="w-full grow">
					<h2 className="text-2xl font-semibold tracking-tight">
						Liked tracks
					</h2>
					<TypographyMuted>Last tracks liked</TypographyMuted>
					<Separator />
					<ScrollArea className="py-4 grow">
						<div className=" space-x-4 flex">
							{tracksLikedByUser.map(track =>
								track?.spotifyTrackData ? (
									<SquareTrackCard
										key={track._id}
										track={track.spotifyTrackData}
									/>
								) : null,
							)}
						</div>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</section>
			</div>
		</div>
	);
}
