import { Collection } from "$lib/schemas/collection";
import { Paginated } from "$lib/schemas/paginated";
import { Playlist } from "$lib/schemas/playlist";
import { Track } from "$lib/schemas/track";
import { User } from "$lib/schemas/user";
import { $api, getPermalinkPath } from "./utils";
import { $fetch } from "./utils.remote";

export async function resolveUser(user: string) {
  return await $api(getPermalinkPath(user), {
    schema: User,
  });
}

export async function getUserById(id: number) {
  return await $api(`/users/${id}`, {
    schema: User,
  });
}

export async function getUserTracks({
  id,
  offset,
  limit,
}: {
  id: number;
} & Paginated) {
  // i think soundcloud ip banned my vps, but it's only affecting this single endpoint?
  // set VITE_ALTERNATIVE_USER_TRACKS_API=true to use another server for this endpoint
  if (import.meta.env.VITE_ALTERNATIVE_USER_TRACKS_API === "true") {
    const res = await $fetch({
      input: `https://sc.maid.zone/_/api/user/${id}/tracks?pagination=limit%3D${10}%26offset%3D${offset}`,
    });
    return res as Collection<Track>;
  }

  return await $api(`/users/${id}/tracks`, {
    params: { limit, offset },
    headers: { "Accept-Language": "en-US,en;q=0.5" },
    schema: Collection(Track),
  });
}

export async function getUserPlaylists({
  id,
  offset,
  limit,
}: {
  id: number;
} & Paginated) {
  return await $api(`/users/${id}/playlists`, {
    params: { limit, offset },
    schema: Collection(Playlist),
  });
}
