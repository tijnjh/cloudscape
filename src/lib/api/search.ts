import { Collection } from "$lib/schemas/collection";
import { Paginated } from "$lib/schemas/paginated";
import { Playlist } from "$lib/schemas/playlist";
import { Track } from "$lib/schemas/track";
import { User } from "$lib/schemas/user";
import { $api } from "./utils";
import * as v from "valibot";

export async function searchAnything({
  query,
  offset,
  limit,
}: {
  query: string;
} & Paginated) {
  return await $api
    .get("/search", {
      searchParams: { q: query, limit, offset },
    })
    .json(Collection(v.union([Track, Playlist, User])));
}

export async function searchTracks({
  query,
  offset,
  limit,
}: {
  query: string;
} & Paginated) {
  return await $api
    .get("/search/tracks", {
      searchParams: { q: query, limit, offset },
    })
    .json(Collection(Track));
}

export async function searchPlaylists({
  query,
  offset,
  limit,
}: {
  query: string;
} & Paginated) {
  return await $api
    .get("/search/playlists", {
      searchParams: { q: query, limit, offset },
    })
    .json(Collection(Playlist));
}

export async function searchUsers({
  query,
  offset,
  limit,
}: {
  query: string;
} & Paginated) {
  return await $api
    .get("/search/users", {
      searchParams: { q: query, limit, offset },
    })
    .json(Collection(User));
}
