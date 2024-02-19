import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { create } from 'zustand';

interface SpotifyPlayerState {
	player: Spotify.Player | null;
	state: Spotify.PlaybackState | null;
	deviceId: string | null;
	actions: {
		play: (args: { spotifyId: string; startedAt: number }) => void;
	};
}

export const useSpotifyPlayerStore = create<SpotifyPlayerState>()((
	set,
	get,
) => {
	const sdk = SpotifyApi.withUserAuthorization(
		import.meta.env.VITE_SPOTIFY_CLIENT_ID,
		'http://localhost:5173',
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

	sdk.authenticate();

	/**
	 * Initialize the Spotify Web Playback SDK
	 */
	window.onSpotifyWebPlaybackSDKReady = () => {
		const player = new window.Spotify.Player({
			name: 'La Radio Despote',
			getOAuthToken: async cb => {
				sdk.getAccessToken().then(token => cb(token!.access_token));
			},
			volume: 0.2,
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
		api: sdk,
		player: null,
		state: null,
		deviceId: null,
		actions: {
			play({ spotifyId, startedAt }) {
				return sdk.player.startResumePlayback(get().deviceId!, undefined, [
					`spotify:track:${spotifyId}`,
				]);

				// return sdk.({
				// 	device_id: get().deviceId!,
				// 	uris: [`spotify:track:${spotifyId}`],
				// });
			},
			pause() {
				return get().player?.pause();
			},
		},
	};
});
