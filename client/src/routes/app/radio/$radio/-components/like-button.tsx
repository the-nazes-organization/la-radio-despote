import { Button } from '@/components/ui/button';
import {
	useLikeTrack,
	useTrackIsLiked,
} from '@/lib/providers/react-query/queries';
import { useAuthedMutation } from '@/lib/useAuthedMutation';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { api } from 'server';
import { Doc, Id } from 'server/functions/_generated/dataModel';

interface LikeButtonProps {
	roomId: Id<'rooms'>;
	playing: { spotifyTrackData: Doc<'spotifyTrackData'> } & Doc<'tracks'>;
}

export const LikeButton = ({ roomId, playing }: LikeButtonProps) => {
	const addLikeReaction = useAuthedMutation(
		api.external.reactions.mutations.addLikeReaction,
	);
	const removeLikeReaction = useAuthedMutation(
		api.external.reactions.mutations.removeLikeReaction,
	);

	const { data: isLiked } = useTrackIsLiked(playing.spotifyTrackData.spotifyId);

	const { mutate: likeTrack } = useLikeTrack();

	const handleLike = async () => {
		if (!playing.spotifyTrackData.spotifyId || isLiked === undefined) return;
		likeTrack({ isLiked, trackId: playing.spotifyTrackData.spotifyId });
		if (!isLiked) {
			addLikeReaction({
				roomId,
				trackId: playing._id,
				askedBy: playing.askedBy || null,
			});
		} else {
			removeLikeReaction({
				trackId: playing._id,
			});
		}
	};

	return (
		<Button variant="outline" size="icon" className="rounded-full">
			<Heart
				onClick={handleLike}
				className={cn(isLiked ? 'fill-red-500 text-red-500' : 'fill-white')}
			/>
		</Button>
	);
};
