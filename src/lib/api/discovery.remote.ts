import { Collection } from "$lib/schemas/collection";
import { Playlist } from "$lib/schemas/playlist";
import { Selection } from "$lib/schemas/selection";
import { Track } from "$lib/schemas/track";
import { User } from "$lib/schemas/user";
import { $api } from "./utils/api";
import { effectfulQuery } from "./utils/remote-functions.effect";
import { Effect, Schema } from "effect";
import * as v from "valibot";

export const getSelections = effectfulQuery(
  Schema.Undefined,
  Effect.fn(function* () {
    const res = yield* $api("/mixed-selections", {
      schema: Collection(Selection(v.union([Playlist, User]))),
    });

    return res.collection;
  }),
);

export const getRelatedTracks = effectfulQuery(
  Schema.Number,
  Effect.fn(function* (id) {
    return yield* $api(`/tracks/${id}/related`, {
      schema: Collection(Track),
    });
  }),
);
