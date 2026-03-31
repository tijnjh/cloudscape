import { query } from "$app/server";
import { Collection } from "$lib/schemas/collection";
import { Playlist } from "$lib/schemas/playlist";
import { Selection } from "$lib/schemas/selection";
import { Track } from "$lib/schemas/track";
import { User } from "$lib/schemas/user";
import { $api } from "./utils";
import { Result } from "better-result";
import * as v from "valibot";

export const getSelections = query(() =>
  Result.tryPromise(() =>
    $api("/mixed-selections").json<Collection<Selection<Playlist | User>>>(),
  ),
);

export const getRelatedTracks = query(v.number(), (id) =>
  Result.tryPromise(() =>
    $api(`/tracks/${id}/related`).json<Collection<Track>>(),
  ),
);
