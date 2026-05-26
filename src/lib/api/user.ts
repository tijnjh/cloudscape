import { Collection } from "$lib/schemas/collection";
import { Playlist } from "$lib/schemas/playlist";
import { Track } from "$lib/schemas/track";
import { User } from "$lib/schemas/user";
import type { WithPagination } from "$lib/types";
import { $api, getPermalinkPath } from "./utils";

export async function resolveUser(user: string) {
  return await $api(getPermalinkPath(user), { schema: User });
}

export async function getUserById(id: number) {
  return await $api(`/users/${id}`, { schema: User });
}

export async function getUserTracks({
  id,
  offset,
  limit,
}: WithPagination<{ id: number }>) {
  return await $api(`/users/${id}/tracks`, {
    searchParams: { limit, offset },
    schema: Collection(Track),
  });
}

export async function getUserPlaylists({
  id,
  offset,
  limit,
}: WithPagination<{ id: number }>) {
  return await $api(`/users/${id}/playlists`, {
    searchParams: { limit, offset },
    schema: Collection(Playlist),
  });
}
