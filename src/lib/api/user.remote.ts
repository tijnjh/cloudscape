import { query } from "$app/server";
import { Collection } from "$lib/schemas/collection";
import { Paginated } from "$lib/schemas/paginated";
import { Playlist } from "$lib/schemas/playlist";
import { Track } from "$lib/schemas/track";
import { User } from "$lib/schemas/user";
import { devSchema } from "$lib/utils";
import { $api, getPermalinkPath } from "./utils";
import { Result } from "better-result";
import * as v from "valibot";

export const resolveUser = query(v.string(), (user) =>
  Result.tryPromise(() => $api(getPermalinkPath(user)).json(devSchema(User))),
);

export const getUserById = query(v.number(), (id) =>
  Result.tryPromise(() => $api(`/users/${id}`).json(devSchema(User))),
);

export const getUserTracks = query(
  v.object({
    ...Paginated.entries,
    id: v.number(),
  }),
  ({ id, offset, limit }) =>
    Result.tryPromise(() =>
      $api(`/users/${id}/tracks`, {
        searchParams: { limit, offset },
        headers: { "Accept-Language": "en-US,en;q=0.5" },
      }).json(devSchema(Collection(Track))),
    ),
);

export const getUserPlaylists = query(
  v.object({
    ...Paginated.entries,
    id: v.number(),
  }),
  ({ id, offset, limit }) =>
    Result.tryPromise(() =>
      $api(`/users/${id}/playlists`, {
        searchParams: { limit, offset },
      }).json(devSchema(Collection(Playlist))),
    ),
);
