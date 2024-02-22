import { useAction } from 'convex/react';
import { useSpotifyPlayerStore } from './providers/SpotifyPlayerProvider';
import {
	DefaultFunctionArgs,
	FunctionReference,
	OptionalRestArgs,
} from 'convex/server';

export const useAuthedAction = <TArgs extends DefaultFunctionArgs>(
	actionReference: FunctionReference<'action', 'public', TArgs>,
) => {
	const { sdk } = useSpotifyPlayerStore();
	const actionFunction = useAction(actionReference);

	return async (
		arg: Omit<
			OptionalRestArgs<FunctionReference<'action', 'public', TArgs>>[0],
			'token'
		>,
	) => {
		const token = await sdk.getAccessToken().then(auth => {
			if (!auth) {
				throw new Error('Not authenticated');
			}
			return auth.access_token;
		});

		const argsWithToken = { ...arg, token };

		actionFunction(
			...([argsWithToken] as unknown as OptionalRestArgs<
				FunctionReference<'action', 'public', TArgs>
			>),
		);
	};
};
