import { ReactNode, createContext, useContext } from "react";

import { create } from "zustand";

interface SpotifyPlayerState {
  player: Spotify.Player | null;
  state: Spotify.PlaybackState | null;
}

export const useSpotifyPlayerStore = create<SpotifyPlayerState>()((set) => ({
  player: null,
  state: null,
}));

const SpotifyPlayerContext = createContext<{
  player: Spotify.Player;
}>(null as any);

export const useSpotifyPlayerContext = () => {
  return useContext(SpotifyPlayerContext);
};

window.onSpotifyWebPlaybackSDKReady = () => {
  const player = new Spotify.Player({
    name: "La Radio Despote",
    getOAuthToken: (cb) => {
      let token = sessionStorage.getItem("spotify_token");

      if (!token) {
        token = prompt("give token pls")!;
        sessionStorage.setItem("spotify_token", token);
      }

      cb(token);
    },
    volume: 0.5,
  });

  useSpotifyPlayerStore.setState({ player });

  player.addListener("player_state_changed", (state) => {
    useSpotifyPlayerStore.setState({ state });
  });

  // Ready
  player.addListener("ready", ({ device_id }) => {
    console.log("Ready with Device ID", device_id);
  });

  // Not Ready
  player.addListener("not_ready", ({ device_id }) => {
    console.log("Device ID has gone offline", device_id);
  });

  player.addListener("initialization_error", ({ message }) => {
    console.error(message);
  });

  player.addListener("authentication_error", ({ message }) => {
    console.error(message);
  });

  player.addListener("account_error", ({ message }) => {
    console.error(message);
  });

  player.connect();
};

export default function SpotifyPlayerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const player = useSpotifyPlayerStore((state) => state.player);

  if (!player) {
    return "...";
  }

  return (
    <SpotifyPlayerContext.Provider value={{ player }}>
      {children}

      <div className="absolute"></div>
    </SpotifyPlayerContext.Provider>
  );
}
