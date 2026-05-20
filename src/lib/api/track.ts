import { paginated_limit } from "$lib/constants";
import { Collection } from "$lib/schemas/collection";
import { Comment } from "$lib/schemas/comment";
import type { Paginated } from "$lib/schemas/paginated";
import { Track } from "$lib/schemas/track";
import { $api, getPermalinkPath } from "./utils";
import * as v from "valibot";

export async function resolveTrack({
  user,
  track,
}: {
  user: string;
  track: string;
}) {
  return await $api.get(getPermalinkPath(user, track)).json(Track);
}

export async function getTrackById(id: number) {
  return await $api.get(`/tracks/${id}`).json(Track);
}

export async function getTracksByIds(ids: number[]) {
  if (!ids.length) {
    return [];
  }

  return await $api
    .get("/tracks", {
      searchParams: {
        ids: ids.join(","),
        limit: paginated_limit,
      },
    })
    .json(v.array(Track));
}

export async function getTrackComments({
  id,
  offset,
  limit,
}: {
  id: number;
} & Paginated) {
  return await $api
    .get(`/tracks/${id}/comments`, {
      searchParams: {
        limit,
        offset,
        threaded: 1,
      },
    })
    .json(Collection(Comment));
}
