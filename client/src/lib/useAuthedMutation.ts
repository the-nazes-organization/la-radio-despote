import { useMutation } from 'convex/react';
import {
	DefaultFunctionArgs,
	FunctionReference,
	OptionalRestArgs,
} from 'convex/server';
import { useSpotifyPlayerStore } from './providers/SpotifyPlayerProvider';

export const useAuthedMutation = <TArgs extends DefaultFunctionArgs>(
	actionReference: FunctionReference<'mutation', 'public', TArgs>,
) => {
	const { sdk } = useSpotifyPlayerStore();
	const actionFunction = useMutation(actionReference);

	return async (
		arg: Omit<
			OptionalRestArgs<FunctionReference<'mutation', 'public', TArgs>>[0],
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
				FunctionReference<'mutation', 'public', TArgs>
			>),
		);
	};
};
