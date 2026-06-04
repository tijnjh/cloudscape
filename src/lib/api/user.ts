import type { WithPagination } from "$lib/types";
import { $api, getPermalinkPath } from "./utils";

export async function resolveUser(user: string) {
  return await $api<SC.User>(getPermalinkPath(user));
}

export async function getUserById(id: number) {
  return await $api<SC.User>(`/users/${id}`);
}

export async function getUserTracks({
  id,
  offset,
  limit,
}: WithPagination<{ id: number }>) {
  return await $api<SC.Collection<SC.Track>>(`/users/${id}/tracks`, {
    searchParams: { limit, offset },
  });
}

export async function getUserPlaylists({
  id,
  offset,
  limit,
}: WithPagination<{ id: number }>) {
  return await $api<SC.Collection<SC.Playlist>>(`/users/${id}/playlists`, {
    searchParams: { limit, offset },
  });
}
