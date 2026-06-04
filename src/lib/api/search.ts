import type { WithPagination } from "$lib/types";
import { $api } from "./utils";

export async function searchAnything({
  query,
  offset,
  limit,
}: WithPagination<{ query: string }>) {
  return await $api<SC.Collection<SC.Track | SC.Playlist | SC.User>>(
    "/search",
    {
      searchParams: { q: query, limit, offset },
    },
  );
}

export async function searchTracks({
  query,
  offset,
  limit,
}: WithPagination<{ query: string }>) {
  return await $api<SC.Collection<SC.Track>>("/search/tracks", {
    searchParams: { q: query, limit, offset },
  });
}

export async function searchPlaylists({
  query,
  offset,
  limit,
}: WithPagination<{ query: string }>) {
  return await $api<SC.Collection<SC.Playlist>>("/search/playlists", {
    searchParams: { q: query, limit, offset },
  });
}

export async function searchUsers({
  query,
  offset,
  limit,
}: WithPagination<{ query: string }>) {
  return await $api<SC.Collection<SC.User>>("/search/users", {
    searchParams: { q: query, limit, offset },
  });
}
