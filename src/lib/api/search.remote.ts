import { query } from "$app/server";
import { Collection } from "$lib/schemas/collection";
import { Paginated } from "$lib/schemas/paginated";
import { Playlist } from "$lib/schemas/playlist";
import { Track } from "$lib/schemas/track";
import { User } from "$lib/schemas/user";
import { devSchema } from "$lib/utils";
import { $api } from "./utils";
import * as v from "valibot";

export const searchTracks = query(
  v.object({
    ...Paginated.entries,
    query: v.string(),
  }),
  async ({ query, offset, limit }) => {
    const response = await $api("/search/tracks", {
      searchParams: { q: query, limit, offset },
    }).json(devSchema(Collection(Track)));
    return response.collection;
  },
);

export const searchPlaylists = query(
  v.object({
    ...Paginated.entries,
    query: v.string(),
  }),
  async ({ query, offset, limit }) => {
    const response = await $api("/search/playlists", {
      searchParams: { q: query, limit, offset },
    }).json(devSchema(Collection(Playlist)));
    return response.collection;
  },
);

export const searchUsers = query(
  v.object({
    ...Paginated.entries,
    query: v.string(),
  }),
  async ({ query, offset, limit }) => {
    const response = await $api("/search/users", {
      searchParams: { q: query, limit, offset },
    }).json(devSchema(Collection(User)));
    return response.collection;
  },
);
