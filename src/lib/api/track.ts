import { PUBLIC_TRACK_SOURCE_ENDPOINT } from "$env/static/public";
import { paginated_limit } from "$lib/constants";
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
  return await $api(getPermalinkPath(user, track), {
    schema: Track,
  });
}

export async function getTrackById(id: number) {
  return await $api(`/tracks/${id}`, {
    schema: Track,
  });
}

export async function getTracksByIds(ids: number[]) {
  if (!ids.length) {
    return [];
  }

  return await $api("/tracks", {
    params: {
      ids: ids.join(","),
      limit: paginated_limit,
    },
    schema: v.array(Track),
  });
}

export async function getTrackSource(id: number) {
  const res = await $api<{ url: string }>(PUBLIC_TRACK_SOURCE_ENDPOINT, {
    params: { id },
  });
  return res.url;
}
