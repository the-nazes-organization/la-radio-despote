import { ConvexProviderWithAuth, ConvexReactClient } from 'convex/react';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useSpotifyPlayerStore } from './SpotifyPlayerProvider';

function useAuthFromProviderX() {
	const player = useSpotifyPlayerStore();
	const [isLoading, setIsLoading] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const fetchAccessToken = useCallback(async () => {
		setIsLoading(true);
		const accesToken = await player.sdk.getAccessToken();
		setIsAuthenticated(accesToken?.access_token !== undefined);
		setIsLoading(false);
		return accesToken?.access_token || '';
	}, [player]);

	return useMemo(
		() => ({
			fetchAccessToken,
			isLoading,
			isAuthenticated,
		}),
		[fetchAccessToken, isLoading, isAuthenticated],
	);
}

export const convexClient = new ConvexReactClient(
	import.meta.env.VITE_CONVEX_URL,
	{},
);

export default function ConvexClientProvider({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<ConvexProviderWithAuth
			client={convexClient}
			useAuth={useAuthFromProviderX}
		>
			{children}
		</ConvexProviderWithAuth>
	);
}
