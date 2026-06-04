import { $api, getPermalinkPath } from "./utils";

export function resolvePlaylist({
  user,
  playlist,
}: {
  user: string;
  playlist: string;
}) {
  return $api<SC.Playlist>(getPermalinkPath(user, "sets", playlist));
}

export function getPlaylistById(id: number) {
  return $api<SC.Playlist>(`/playlists/${id}`);
}
