import { Button } from '@/components/ui/button';
import { useAuthedAction } from '@/lib/useAuthedAction';
import { SkipForward } from 'lucide-react';
import { api } from 'server';
import { Id } from 'server/functions/_generated/dataModel';
import { Route } from '../../$radio';

interface NextTrackButtonProps {}

export const NextTrackButton = ({}: NextTrackButtonProps) => {
	const { radio } = Route.useParams<{ radio: Id<'rooms'> }>();
	const playNextTrack = useAuthedAction(api.tracksActions.playTrack);

	const handleClick = async () => {
		await playNextTrack({ roomId: radio });
	};

	return (
		<Button
			variant="outline"
			size="icon"
			className="rounded-full"
			onClick={handleClick}
		>
			<SkipForward />
		</Button>
	);
};
