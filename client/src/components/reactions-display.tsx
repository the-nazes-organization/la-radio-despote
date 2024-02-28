import confetti from 'canvas-confetti';
import { useQuery } from 'convex/react';
import { useEffect, useRef } from 'react';
import { api } from 'server';
import { Doc, Id } from 'server/functions/_generated/dataModel';

interface ReactionsDisplayProps {
	roomId: Id<'rooms'>;
}

const heart = confetti.shapeFromPath({
	path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
});

export const ReactionsDisplay = ({ roomId }: ReactionsDisplayProps) => {
	const reactions = useQuery(api.reactions.queries.getReactions, {
		roomId,
	});
	const previousReactions = useRef<Doc<'reactions'>[]>([]);

	useEffect(() => {
		if (
			previousReactions.current.length === 0 &&
			reactions &&
			reactions?.length > 0
		) {
			previousReactions.current = [reactions.at(-1)!];
			return;
		} else if (reactions && reactions?.length > 0) {
			reactions
				.filter(
					reaction =>
						reaction._creationTime >
						previousReactions.current.at(-1)!._creationTime,
				)
				.forEach(reaction => {
					confetti({
						particleCount: 100,
						spread: 70,
						origin: { y: 1 },
						shapes: [heart],
						colors: ['#f93963', '#a10864', '#ee0b93'],
					});
					previousReactions.current.push(reaction);
				});
		}
	}, [reactions]);

	return <></>;
};
