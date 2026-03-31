import { query } from "$app/server";
import { Playlist } from "$lib/schemas/playlist";
import { devSchema } from "$lib/utils";
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
      $api(getPermalinkPath(user, "sets", playlist))
        .json()
        .then((r) => devSchema(Playlist, r)),
    ),
);

export const getPlaylistById = query(v.number(), (id) =>
  Result.tryPromise(() => $api(`/playlists/${id}`).json()).then((r) =>
    devSchema(Playlist, r),
  ),
);
