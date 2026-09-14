import type { Collection } from '$lib/types/collection'
import type { Playlist } from '$lib/types/playlist'
import type { Selection } from '$lib/types/selection'
import type { SystemPlaylist } from '$lib/types/system-playlist'
import type { Track } from '$lib/types/track'
import type { User } from '$lib/types/user'
import typia from 'typia'
import { $api } from './utils'

type SelectionItem = Playlist | User | SystemPlaylist

export async function getSelections() {
  return await $api('/mixed-selections', {
    schema: typia.createAssert<Collection<Selection<SelectionItem>>>(),
  })
}

export async function getRelatedTracks(id: number) {
  return await $api(`/tracks/${id}/related`, {
    schema: typia.createAssert<Collection<Track>>(),
  })
}

export async function getSearchSuggestions(query: string, signal?: AbortSignal) {
  return await $api('/search/queries', {
    searchParams: { q: query },
    signal,
    schema: typia.createAssert<Collection<{
      output: string
      query: string
    }>>(),
  })
}
