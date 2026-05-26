import { Collection } from "$lib/schemas/collection";
import { Playlist } from "$lib/schemas/playlist";
import { Track } from "$lib/schemas/track";
import { User } from "$lib/schemas/user";
import type { WithPagination } from "$lib/types";
import { $api } from "./utils";
import * as v from "valibot";

export async function searchAnything({
  query,
  offset,
  limit,
}: WithPagination<{ query: string }>) {
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
}: WithPagination<{ query: string }>) {
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
}: WithPagination<{ query: string }>) {
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
}: WithPagination<{ query: string }>) {
  return await $api
    .get("/search/users", {
      searchParams: { q: query, limit, offset },
    })
    .json(Collection(User));
}
