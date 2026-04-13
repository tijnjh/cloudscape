import { Playlist } from "$lib/schemas/playlist";
import { $api, getPermalinkPath } from "./utils";

export function resolvePlaylist({
  user,
  playlist,
}: {
  user: string;
  playlist: string;
}) {
  return $api<Playlist>(getPermalinkPath(user, "sets", playlist));
  // we don't enforce the schema here because it can also return a system playlist which differs slightly from the regular playlist schema
  // will implement a more robust solution for this in the future
}

export function getPlaylistById(id: number) {
  return $api(`/playlists/${id}`, {
    schema: Playlist,
  });
}
