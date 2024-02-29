import { Button } from '@/components/ui/button';
import { useAuthedAction } from '@/lib/useAuthedAction';
import { SkipForward } from 'lucide-react';
import { api } from 'server';
import { Id } from 'server/functions/_generated/dataModel';
import { Route } from '../../$radio';

export const NextTrackButton = () => {
	const { radio } = Route.useParams<{ radio: Id<'rooms'> }>();
	const skipTrack = useAuthedAction(api.external.player.actions.playNextTrack);

	const handleClick = async () => {
		await skipTrack({ roomId: radio });
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
