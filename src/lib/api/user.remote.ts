import { Collection } from "$lib/schemas/collection";
import { Paginated } from "$lib/schemas/paginated";
import { Playlist } from "$lib/schemas/playlist";
import { Track } from "$lib/schemas/track";
import { User } from "$lib/schemas/user";
import { $api, getPermalinkPath } from "./utils/api";
import { effectfulQuery } from "./utils/remote-functions.effect";
import { Effect, Schema } from "effect";

export const resolveUser = effectfulQuery(Schema.String, (user) =>
  $api(getPermalinkPath(user), {
    schema: User,
  }),
);

export const getUserById = effectfulQuery(Schema.Number, (id) =>
  $api(`/users/${id}`, {
    schema: User,
  }),
);

export const getUserTracks = effectfulQuery(
  Schema.Struct({
    ...Paginated.fields,
    id: Schema.Number,
  }),
  Effect.fn(function* ({ id, offset, limit }) {
    const res = yield* $api(`/users/${id}/tracks`, {
      params: { limit, offset },
      headers: { "Accept-Language": "en-US,en;q=0.5" },
      schema: Collection(Track),
    });
    return res.collection;
  }),
);

export const getUserPlaylists = effectfulQuery(
  Schema.Struct({
    ...Paginated.fields,
    id: Schema.Number,
  }),
  Effect.fn(function* ({ id, offset, limit }) {
    const res = yield* $api(`/users/${id}/playlists`, {
      params: { limit, offset },
      schema: Collection(Playlist),
    });
    return res.collection;
  }),
);
