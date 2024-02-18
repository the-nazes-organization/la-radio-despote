import { SpotifyApi } from '@spotify/web-api-ts-sdk';

export const spotifyApi = SpotifyApi.withClientCredentials(
	process.env.SPOTIFY_CLIENT_ID!,
	process.env.SPOTIFY_CLIENT_SECRET!,
);
