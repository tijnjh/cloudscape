import { Collection } from "$lib/schemas/collection";
import { Paginated } from "$lib/schemas/paginated";
import { Playlist } from "$lib/schemas/playlist";
import { Track } from "$lib/schemas/track";
import { User } from "$lib/schemas/user";
import { $api } from "./utils";

export async function searchTracks({
  query,
  offset,
  limit,
}: {
  query: string;
} & Paginated) {
  return await $api("/search/tracks", {
    params: { q: query, limit, offset },
    schema: Collection(Track),
  });
}

export async function searchPlaylists({
  query,
  offset,
  limit,
}: {
  query: string;
} & Paginated) {
  return await $api("/search/playlists", {
    params: { q: query, limit, offset },
    schema: Collection(Playlist),
  });
}

export async function searchUsers({
  query,
  offset,
  limit,
}: {
  query: string;
} & Paginated) {
  return await $api("/search/users", {
    params: { q: query, limit, offset },
    schema: Collection(User),
  });
}
