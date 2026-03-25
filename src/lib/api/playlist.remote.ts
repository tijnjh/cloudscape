import { query } from "$app/server";
import { Playlist } from "$lib/schemas/playlist";
import { devOnly } from "$lib/utils";
import { $api, getPermalinkPath } from "./utils";
import * as v from "valibot";

export const resolvePlaylist = query(
  v.object({
    user: v.string(),
    playlist: v.string(),
  }),
  ({ user, playlist }) =>
    $api(getPermalinkPath(user, "sets", playlist), {
      schema: devOnly(Playlist),
    }),
);

export const getPlaylistById = query(v.number(), (id) =>
  $api(`/playlists/${id}`, {
    schema: devOnly(Playlist),
  }),
);
