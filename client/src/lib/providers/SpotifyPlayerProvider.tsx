import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { differenceInMilliseconds } from 'date-fns';
import { create } from 'zustand';

interface SpotifyPlayerState {
	sdk: SpotifyApi;
	player: Spotify.Player | null;
	state: Spotify.PlaybackState | null;
	deviceId: string | null;
	isPlayerDisabled: boolean;
	actions: {
		setPlayerDisabled: (isPlayerDisabled: boolean) => void;
		play: (args: { spotifyId: string; playedAt: number }) => void;
	};
}

export const useSpotifyPlayerStore = create<SpotifyPlayerState>()((
	set,
	get,
) => {
	const sdk = SpotifyApi.withUserAuthorization(
		import.meta.env.VITE_SPOTIFY_CLIENT_ID,
		`${window.location.origin}/login`,
		[
			'user-read-email',
			'user-read-private',
			'streaming',
			'user-library-read',
			'user-library-modify',
			'user-read-playback-state',
			'playlist-modify-public',
			'playlist-read-private',
			'playlist-modify-private',
		],
	);

	// sdk.authenticate();

	/**
	 * Initialize the Spotify Web Playback SDK
	 */
	window.onSpotifyWebPlaybackSDKReady = async () => {
		const player = new window.Spotify.Player({
			name: 'La Radio Despote',
			getOAuthToken: async cb => {
				sdk.getAccessToken().then(token => {
					if (token) {
						cb(token.access_token);
					}
				});
			},
			// volume: 1,
		});

		set({ player });

		player.addListener('player_state_changed', state => {
			set({ state });
		});

		player.addListener('ready', ({ device_id }) => {
			console.log('Ready with Device ID', device_id);
			set({ deviceId: device_id });
		});

		player.addListener('not_ready', ({ device_id }) => {
			console.log('Device ID has gone offline', device_id);
		});

		player.addListener('initialization_error', ({ message }) => {
			console.error(message);
		});

		player.addListener('authentication_error', ({ message }) => {
			console.error(message);
		});

		player.addListener('account_error', ({ message }) => {
			console.error(message);
		});

		player.connect();
	};

	return {
		sdk,
		player: null,
		state: null,
		deviceId: null,
		isPlayerDisabled: !!localStorage.getItem('spotify:player:disabled'),
		actions: {
			setPlayerDisabled(isPlayerDisabled) {
				set({ isPlayerDisabled });

				return isPlayerDisabled
					? localStorage.setItem('spotify:player:disabled', 'true')
					: localStorage.removeItem('spotify:player:disabled');
			},

			async play({ spotifyId, playedAt }) {
				if (get().isPlayerDisabled) {
					return;
				}

				const diff = differenceInMilliseconds(new Date(), new Date(playedAt));

				await sdk.player.startResumePlayback(
					get().deviceId!,
					undefined,
					[`spotify:track:${spotifyId}`],
					undefined,
					diff,
				);
			},
			pause() {
				return get().player?.pause();
			},
		},
	};
});
