import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { Id } from 'server/functions/_generated/dataModel';
import { Button } from './ui/button';

interface AddTrackButtonProps {
	spotifyTrackId: string;
	roomId: Id<'rooms'>;
}

export const AddTrackButton = ({
	roomId,
	spotifyTrackId,
}: AddTrackButtonProps) => {
	// const authedRequestTrack = useAuthedAction(
	// 	api.external.rooms..actions.requestTrack,
	// );
	const [isLoading, setIsLoading] = useState(false);

	const handleClick = async () => {
		try {
			setIsLoading(true);
			// await authedRequestTrack({
			// 	spotifyTrackId,
			// 	roomId,
			// });
		} finally {
			setTimeout(() => {
				setIsLoading(false);
			}, 300);
		}
	};

	return (
		<Button className="rounded-full size-6" size={'icon'} onClick={handleClick}>
			{isLoading ? (
				<Loader2 className={' animate-spin size-4 min-w-6'} />
			) : (
				<Plus />
			)}
		</Button>
	);
};
