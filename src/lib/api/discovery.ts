import { Collection } from "$lib/schemas/collection";
import { Playlist } from "$lib/schemas/playlist";
import { Selection } from "$lib/schemas/selection";
import { Track } from "$lib/schemas/track";
import { User } from "$lib/schemas/user";
import { $api } from "./utils";
import * as v from "valibot";

export async function getSelections() {
  return await $api("/mixed-selections", {
    schema: Collection(Selection(v.union([Playlist, User]))),
  });
}

export async function getRelatedTracks(id: number) {
  return await $api(`/tracks/${id}/related`, {
    schema: Collection(Track),
  });
}
