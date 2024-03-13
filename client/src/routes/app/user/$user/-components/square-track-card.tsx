import { Link } from '@tanstack/react-router';
import { BoomBox } from 'lucide-react';
import { SquareTrackCardProps } from '..';

export const SquareTrackCard = ({ track, radio }: SquareTrackCardProps) => {
	return (
		<div className="flex flex-col space-y-3 size-20 h-auto ">
			<span data-state="closed">
				<div className="overflow-hidden rounded-md">
					<img
						alt="Functional Fury"
						loading="lazy"
						width="150"
						height="150"
						decoding="async"
						data-nimg="1"
						className="h-auto w-auto object-cover transition-all hover:scale-105 aspect-square"
						src={track.album.images[0].url}
						style={{ color: 'transparent' }}
					/>
				</div>
			</span>
			<div className="space-y-1 text-sm">
				<h3 className="font-medium leading-none">{track.name}</h3>
				<p className="text-xs text-muted-foreground">
					{track.artists.map(a => a.name).join(', ')}
				</p>

				{radio && (
					<Link
						to={`/app/radio/$radio`}
						params={{ radio: radio?._id }}
						className="hover:underline"
					>
						<p className="flex text-xs text-muted-foreground space-x-1 ">
							<BoomBox className="size-4" />
							<span className="line-clamp-1">{radio.name}</span>
						</p>
					</Link>
				)}
			</div>
		</div>
	);
};
