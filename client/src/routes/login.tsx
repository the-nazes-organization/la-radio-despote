import { Button } from '@/components/ui/button';
import { convexClient } from '@/lib/providers/ConvexProvider';
import { useSpotifyPlayerStore } from '@/lib/providers/SpotifyPlayerProvider';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { api } from 'server';

export const Route = createFileRoute('/login')({
	validateSearch: (search: Record<string, unknown>) => {
		return {
			code: search.code as string | undefined,
		};
	},

	async beforeLoad(opts) {
		const store = useSpotifyPlayerStore.getState();

		const isAuthed = await store.sdk.getAccessToken();

		if (isAuthed) {
			throw redirect({
				to: '/app',
			});
		}

		if (opts.search.code) {
			await store.sdk
				.authenticate()
				.then(async ({ authenticated, accessToken }) => {
					await convexClient.action(
						api.external.auth.actions.createNewSessionInDatabase,
						{
							accessToken: accessToken.access_token,
							refreshToken: accessToken.refresh_token,
						},
					);

					if (authenticated) {
						throw redirect({
							to: '/app',
						});
					}
				});
		}
	},
	component: Login,
});

function Login() {
	const spotify = useSpotifyPlayerStore();

	return (
		<div>
			<Button onClick={() => spotify.sdk.authenticate()}>Login</Button>
		</div>
	);
}
