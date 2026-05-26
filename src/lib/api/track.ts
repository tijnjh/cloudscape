import { max_items_per_page } from "$lib/constants";
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
        limit: max_items_per_page,
      },
    })
    .json(v.array(Track));
}
