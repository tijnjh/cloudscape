import { Collection } from '$lib/schemas/collection'
import { Playlist } from '$lib/schemas/playlist'
import { Selection } from '$lib/schemas/selection'
import { Track } from '$lib/schemas/track'
import { User } from '$lib/schemas/user'
import * as v from 'valibot'
import { $api } from './utils'

export async function getSelections() {
  return await $api('/mixed-selections', {
    schema: Collection(Selection(v.union([Playlist, User]))),
  })
}

export async function getRelatedTracks(id: number) {
  return await $api(`/tracks/${id}/related`, {
    schema: Collection(Track),
  })
}

export async function getSearchSuggestions(query: string, signal?: AbortSignal) {
  return await $api('/search/queries', {
    searchParams: { q: query },
    signal,
    schema: Collection(
      v.object({
        output: v.string(),
        query: v.string(),
      }),
    ),
  })
}
