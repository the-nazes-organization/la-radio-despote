import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuthedAction } from '@/lib/useAuthedAction';
import { ConvexError } from 'convex/values';
import { SkipForward } from 'lucide-react';
import { api } from 'server';
import { Id } from 'server/functions/_generated/dataModel';
import { Route } from '../../$radio';

export const NextTrackButton = () => {
	const { radio } = Route.useParams<{ radio: Id<'rooms'> }>();
	const skipTrack = useAuthedAction(api.external.player.actions.playNextTrack);

	const { toast } = useToast();

	const handleClick = async () => {
		try {
			await skipTrack({ roomId: radio });
		} catch (error) {
			const errorMessage =
				error instanceof ConvexError
					? // Access data and cast it to the type we expect
						(error.data as { message: string }).message
					: 'Unexpected error occurred';
			toast({
				title: errorMessage,
				variant: 'destructive',
			});
		}
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
