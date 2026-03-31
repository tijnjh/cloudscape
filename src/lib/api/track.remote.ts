import { query } from "$app/server";
import { paginated_limit } from "$lib/constants";
import { Track } from "$lib/schemas/track";
import { $api, getPermalinkPath } from "./utils";
import { Result } from "better-result";
import * as v from "valibot";

export const resolveTrack = query(
  v.object({
    user: v.string(),
    track: v.string(),
  }),
  ({ user, track }) =>
    Result.tryPromise(() => $api(getPermalinkPath(user, track)).json<Track>()),
);

export const getTrackById = query(v.number(), (id) =>
  Result.tryPromise(() => $api(`/tracks/${id}`).json<Track>()),
);

export const getTracksByIds = query(v.array(v.number()), (ids) => {
  if (!ids.length) {
    return Result.ok([]);
  }

  return Result.tryPromise(() =>
    $api("/tracks", {
      searchParams: {
        ids: ids.join(","),
        limit: paginated_limit,
      },
    }).json<Track[]>(),
  );
});
