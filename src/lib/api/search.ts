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
  return await $api("/search", {
    searchParams: { q: query, limit, offset },
    schema: Collection(v.union([Track, Playlist, User])),
  });
}

export async function searchTracks({
  query,
  offset,
  limit,
}: WithPagination<{ query: string }>) {
  return await $api("/search/tracks", {
    searchParams: { q: query, limit, offset },
    schema: Collection(Track),
  });
}

export async function searchPlaylists({
  query,
  offset,
  limit,
}: WithPagination<{ query: string }>) {
  return await $api("/search/playlists", {
    searchParams: { q: query, limit, offset },
    schema: Collection(Playlist),
  });
}

export async function searchUsers({
  query,
  offset,
  limit,
}: WithPagination<{ query: string }>) {
  return await $api("/search/users", {
    searchParams: { q: query, limit, offset },
    schema: Collection(User),
  });
}
