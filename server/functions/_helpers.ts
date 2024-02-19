import { Track } from '@spotify/web-api-ts-sdk';

export const formatTrack = (track: Track) => {
	return {
		name: track.name,
		duration: track.duration_ms,
		spotifyId: track.id,
		album: {
			id: track.album.id,
			name: track.album.name,
			images: track.album.images,
		},
		artists: track.artists.map(artist => ({
			id: artist.id,
			name: artist.name,
		})),
	};
};
