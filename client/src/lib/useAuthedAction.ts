import { useAction } from 'convex/react';
import {
	DefaultFunctionArgs,
	FunctionReference,
	OptionalRestArgs,
} from 'convex/server';
import { useCallback } from 'react';
import { useSpotifyPlayerStore } from './providers/SpotifyPlayerProvider';

export const useAuthedAction = <TArgs extends DefaultFunctionArgs>(
	actionReference: FunctionReference<'action', 'public', TArgs>,
) => {
	const { sdk } = useSpotifyPlayerStore();
	const actionFunction = useAction(actionReference);

	return useCallback(
		async (
			arg: Omit<
				OptionalRestArgs<FunctionReference<'action', 'public', TArgs>>[0],
				'token'
			>,
		) => {
			const token = await sdk.getAccessToken().then(auth => {
				if (!auth) {
					throw new Error('Not authenticated');
				}
				return auth.refresh_token;
			});

			const argsWithToken = { ...arg, token };

			return actionFunction(
				...([argsWithToken] as unknown as OptionalRestArgs<
					FunctionReference<'action', 'public', TArgs>
				>),
			);
		},
		[actionFunction, sdk],
	);
};
