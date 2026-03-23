import { paginated_limit } from "$lib/constants";
import { Track } from "$lib/schemas/track";
import { $api, getPermalinkPath } from "./utils/api";
import { effectfulQuery } from "./utils/remote-functions.effect";
import { Effect, Schema } from "effect";
import * as v from "valibot";

export const resolveTrack = effectfulQuery(
  Schema.Struct({
    user: Schema.String,
    track: Schema.String,
  }),
  ({ user, track }) =>
    Effect.gen(function* () {
      return yield* $api(getPermalinkPath(user, track), {
        schema: Track,
      });
    }),
);

export const getTrackById = effectfulQuery(Schema.Number, (id) =>
  Effect.gen(function* () {
    return yield* $api(`/tracks/${id}`, {
      schema: Track,
    });
  }),
);

export const getTracksByIds = effectfulQuery(
  Schema.Array(Schema.Number),
  (ids) =>
    Effect.gen(function* () {
      if (!ids.length) {
        return [];
      }

      return yield* $api("/tracks", {
        params: {
          ids: ids.join(","),
          limit: paginated_limit,
        },
        schema: v.array(Track),
      });
    }),
);
