import { max_items_per_page } from "$lib/constants";
import { $api, getPermalinkPath } from "./utils";
import * as v from "valibot";

export async function resolveTrack({
  user,
  track,
}: {
  user: string;
  track: string;
}) {
  return await $api<SC.Track>(getPermalinkPath(user, track));
}

export async function getTrackById(id: number) {
  return await $api<SC.Track>(`/tracks/${id}`);
}

export async function getTracksByIds(ids: number[]) {
  if (!ids.length) {
    return [];
  }

  return await $api<SC.Track[]>("/tracks", {
    searchParams: {
      ids: ids.join(","),
      limit: max_items_per_page,
    },
  });
}
