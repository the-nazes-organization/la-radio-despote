import { Skeleton } from '../ui/skeleton';

export const TrackSkeleton = () => {
	return (
		<li className="grid grid-cols-[40px_1fr] gap-4">
			<Skeleton className=" size-10  rounded-md" />
			<div className=" self-center space-y-2">
				<Skeleton className="w-24 h-4  rounded-md" />
				<Skeleton className="w-20 h-3  rounded-md" />
			</div>
		</li>
	);
};
