import { Collection } from "$lib/schemas/collection";
import { Playlist } from "$lib/schemas/playlist";
import { Selection } from "$lib/schemas/selection";
import { Track } from "$lib/schemas/track";
import { User } from "$lib/schemas/user";
import { $api } from "./utils";
import * as v from "valibot";

export async function getSelections() {
  return await $api
    .get("/mixed-selections")
    .json(Collection(Selection(v.union([Playlist, User]))));
}

export async function getRelatedTracks(id: number) {
  return await $api.get(`/tracks/${id}/related`).json(Collection(Track));
}

export async function getSearchSuggestions(query: string) {
  return await $api
    .get("/search/queries", {
      searchParams: { q: query },
    })
    .json(
      Collection(
        v.object({
          output: v.string(),
          query: v.string(),
        }),
      ),
    );
}
