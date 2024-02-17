import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "server";
import { useSpotifyPlayerContext } from "../../lib/providers/SpotifyPlayerProvider";

export const Route = createFileRoute("/$radio/")({
  component: Radio,
});

function Radio() {
  const params = Route.useParams();
  const rooms = useQuery(api.rooms.get);

  const { player } = useSpotifyPlayerContext();

  const room = rooms?.find((room) => room.room_id === params.radio);

  return (
    <div className="p-2">
      <h3>Welcome in the radio {params.radio}!</h3>

      <pre>{JSON.stringify(room, null, 2)}</pre>

      <button
        onClick={async () => {
          player.togglePlay();
          console.log(await player.getVolume());
        }}
      >
        play
      </button>
    </div>
  );
}
