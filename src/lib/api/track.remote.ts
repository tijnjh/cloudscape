import { query } from "$app/server";
import { paginated_limit } from "$lib/constants";
import { Track } from "$lib/schemas/track";
import { devSchema } from "$lib/utils";
import { $api, getPermalinkPath } from "./utils";
import * as v from "valibot";

export const resolveTrack = query(
  v.object({
    user: v.string(),
    track: v.string(),
  }),
  ({ user, track }) =>
    $api(getPermalinkPath(user, track)).json(devSchema(Track)),
);

export const getTrackById = query(v.number(), (id) =>
  $api(`/tracks/${id}`).json(devSchema(Track)),
);

export const getTracksByIds = query(v.array(v.number()), (ids) => {
  if (!ids.length) {
    return [];
  }

  return $api("/tracks", {
    searchParams: {
      ids: ids.join(","),
      limit: paginated_limit,
    },
  }).json(devSchema(v.array(Track)));
});
