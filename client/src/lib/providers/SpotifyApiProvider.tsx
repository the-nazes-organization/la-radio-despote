import { ReactNode, createContext, useContext } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import { create } from 'zustand';

interface SpotifyApiState {
	spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
}

export const useSpotifyApiStore = create<SpotifyApiState>()(set => {
	const spotifyApi = new SpotifyWebApi();

	spotifyApi.setAccessToken(sessionStorage.getItem('spotify_token')!);
	spotifyApi.getMe().then(me => console.log('🙆‍♂️', me));

	return {
		spotifyApi,
	};
});
