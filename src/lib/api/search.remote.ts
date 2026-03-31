import { query } from "$app/server";
import { Collection } from "$lib/schemas/collection";
import { Paginated } from "$lib/schemas/paginated";
import { Playlist } from "$lib/schemas/playlist";
import { Track } from "$lib/schemas/track";
import { User } from "$lib/schemas/user";
import { devSchema } from "$lib/utils";
import { $api } from "./utils";
import { Result } from "better-result";
import * as v from "valibot";

export const searchTracks = query(
  v.object({
    ...Paginated.entries,
    query: v.string(),
  }),
  ({ query, offset, limit }) =>
    Result.tryPromise(() =>
      $api("/search/tracks", {
        searchParams: { q: query, limit, offset },
      })
        .json()
        .then((r) => devSchema(Collection(Track), r)),
    ),
);

export const searchPlaylists = query(
  v.object({
    ...Paginated.entries,
    query: v.string(),
  }),
  ({ query, offset, limit }) =>
    Result.tryPromise(() =>
      $api("/search/playlists", {
        searchParams: { q: query, limit, offset },
      })
        .json()
        .then((r) => devSchema(Collection(Playlist), r)),
    ),
);

export const searchUsers = query(
  v.object({
    ...Paginated.entries,
    query: v.string(),
  }),
  ({ query, offset, limit }) =>
    Result.tryPromise(() =>
      $api("/search/users", {
        searchParams: { q: query, limit, offset },
      })
        .json()
        .then((r) => devSchema(Collection(User), r)),
    ),
);
