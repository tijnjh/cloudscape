import { Collection } from "$lib/schemas/collection";
import { Paginated } from "$lib/schemas/paginated";
import { Playlist } from "$lib/schemas/playlist";
import { Track } from "$lib/schemas/track";
import { User } from "$lib/schemas/user";
import { $api, getPermalinkPath } from "./utils";

export async function resolveUser(user: string) {
  return await $api.get(getPermalinkPath(user)).json(User);
}

export async function getUserById(id: number) {
  return await $api.get(`/users/${id}`).json(User);
}

export async function getUserTracks({
  id,
  offset,
  limit,
}: {
  id: number;
} & Paginated) {
  return await $api
    .get(`/users/${id}/tracks`, {
      searchParams: { limit, offset },
    })
    .json(Collection(Track));
}

export async function getUserPlaylists({
  id,
  offset,
  limit,
}: {
  id: number;
} & Paginated) {
  return await $api
    .get(`/users/${id}/playlists`, {
      searchParams: { limit, offset },
    })
    .json(Collection(Playlist));
}
