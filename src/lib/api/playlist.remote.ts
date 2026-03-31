import { query } from "$app/server";
import { Playlist } from "$lib/schemas/playlist";
import { $api, getPermalinkPath } from "./utils";
import { Result } from "better-result";
import * as v from "valibot";

export const resolvePlaylist = query(
  v.object({
    user: v.string(),
    playlist: v.string(),
  }),
  ({ user, playlist }) =>
    Result.tryPromise(() =>
      $api(getPermalinkPath(user, "sets", playlist)).json<Playlist>(),
    ),
);

export const getPlaylistById = query(v.number(), (id) =>
  Result.tryPromise(() => $api(`/playlists/${id}`).json<Playlist>()),
);
