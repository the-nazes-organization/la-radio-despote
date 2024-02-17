import { create } from 'zustand';

interface SpotifyPlayerState {
	player: Spotify.Player | null;
	state: Spotify.PlaybackState | null;
	deviceId: string | null;
}

export const useSpotifyPlayerStore = create<SpotifyPlayerState>()(set => ({
	player: null,
	state: null,
	deviceId: null,
}));

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
				sessionStorage.setItem('spotify_token', token);
			}

			cb(token);
		},
		volume: 0.5,
	});

	useSpotifyPlayerStore.setState({ player });

	player.addListener('player_state_changed', state => {
		useSpotifyPlayerStore.setState({ state });
	});

	// Ready
	player.addListener('ready', ({ device_id }) => {
		console.log('Ready with Device ID', device_id);
		useSpotifyPlayerStore.setState({ deviceId: device_id });
	});

	// Not Ready
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
