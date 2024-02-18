import SpotifyWebApi from 'spotify-web-api-js';
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
	const api = new SpotifyWebApi();

	api.setAccessToken(sessionStorage.getItem('spotify_token')!);

	/**
	 * Initialize the Spotify Web Playback SDK
	 */
	window.onSpotifyWebPlaybackSDKReady = () => {
		const player = new window.Spotify.Player({
			name: 'La Radio Despote',
			getOAuthToken: cb => {
				let token = sessionStorage.getItem('spotify_token');

				if (!token) {
					token = prompt('give token pls')!;
					if (token) sessionStorage.setItem('spotify_token', token);
				}

				cb(token);
			},
			volume: 0.5,
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
		api,
		player: null,
		state: null,
		deviceId: null,
		actions: {
			play({ spotifyId, startedAt }) {
				return api.play({
					device_id: get().deviceId!,
					uris: [`spotify:track:${spotifyId}`],
				});
			},
			pause() {
				return get().player?.pause();
			},
		},
	};
});
