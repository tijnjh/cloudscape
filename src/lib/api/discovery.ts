import { Collection } from '$lib/schemas/collection'
import { Playlist } from '$lib/schemas/playlist'
import { Selection } from '$lib/schemas/selection'
import { Track } from '$lib/schemas/track'
import { User } from '$lib/schemas/user'
import { Effect, Schema } from 'effect'
import { $api } from './utils'

export const getSelections = Effect.fn(function* () {
  return yield* $api('/mixed-selections', {
    schema: Collection(Selection(Schema.Union([Playlist, User]))),
  })
})

export const getRelatedTracks = Effect.fn(function* (id: number) {
  return yield* $api(`/tracks/${id}/related`, {
    schema: Collection(Track),
  })
})

export const getSearchSuggestions = Effect.fn(function* (query: string) {
  return yield* $api('/search/queries', {
    searchParams: { q: query },
    schema: Collection(
      Schema.Struct({
        output: Schema.String,
        query: Schema.String,
      }),
    ),
  })
})
