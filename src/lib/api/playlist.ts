import { Playlist } from "$lib/schemas/playlist";
import { $api, getPermalinkPath } from "./utils";

export function resolvePlaylist({
  user,
  playlist,
}: {
  user: string;
  playlist: string;
}) {
  return $api(getPermalinkPath(user, "sets", playlist), {
    schema: Playlist,
  });
}

export function getPlaylistById(id: number) {
  return $api(`/playlists/${id}`, {
    schema: Playlist,
  });
}
