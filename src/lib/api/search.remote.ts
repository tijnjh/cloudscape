import { Collection } from "$lib/schemas/collection";
import { Paginated } from "$lib/schemas/paginated";
import { Playlist } from "$lib/schemas/playlist";
import { Track } from "$lib/schemas/track";
import { User } from "$lib/schemas/user";
import { $api } from "./utils/api";
import { effectfulQuery } from "./utils/remote-functions.effect";
import { Effect, Schema } from "effect";

export const searchTracks = effectfulQuery(
  Schema.Struct({
    ...Paginated.fields,
    query: Schema.String,
  }),
  Effect.fn(function* ({ query, offset, limit }) {
    const response = yield* $api("/search/tracks", {
      params: { q: query, limit, offset },
      schema: Collection(Track),
    });
    return response.collection;
  }),
);

export const searchPlaylists = effectfulQuery(
  Schema.Struct({
    ...Paginated.fields,
    query: Schema.String,
  }),
  Effect.fn(function* ({ query, offset, limit }) {
    const response = yield* $api("/search/playlists", {
      params: { q: query, limit, offset },
      schema: Collection(Playlist),
    });
    return response.collection;
  }),
);

export const searchUsers = effectfulQuery(
  Schema.Struct({
    ...Paginated.fields,
    query: Schema.String,
  }),
  Effect.fn(function* ({ query, offset, limit }) {
    const response = yield* $api("/search/users", {
      params: { q: query, limit, offset },
      schema: Collection(User),
    });
    return response.collection;
  }),
);
