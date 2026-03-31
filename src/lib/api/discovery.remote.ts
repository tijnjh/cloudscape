import { query } from "$app/server";
import { Collection } from "$lib/schemas/collection";
import { Playlist } from "$lib/schemas/playlist";
import { Selection } from "$lib/schemas/selection";
import { Track } from "$lib/schemas/track";
import { User } from "$lib/schemas/user";
import { devSchema } from "$lib/utils";
import { $api } from "./utils";
import * as v from "valibot";

export const getSelections = query(async () => {
  const res = await $api("/mixed-selections").json(
    devSchema(Collection(Selection(v.union([Playlist, User])))),
  );

  return res.collection;
});

export const getRelatedTracks = query(v.number(), (id) =>
  $api(`/tracks/${id}/related`).json(devSchema(Collection(Track))),
);
