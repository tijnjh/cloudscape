import type { Playlist } from '$lib/schemas/playlist'
import type { Track } from '$lib/schemas/track'
import type { User } from '$lib/schemas/user'
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query'
import { useMemo } from 'react'
import { InfiniteQueryLoadMore } from './InfiniteQueryLoadMore'
import { PlaylistListing } from './listings/PlaylistListing'
import { TrackListing } from './listings/TrackListing'
import { UserListing } from './listings/UserListing'
import { QueryView } from './QueryView'

type Result = Track | Playlist | User

export function InfiniteQueryView<T extends Result>({
  query,
  orderedIds,
}: {
  query: UseInfiniteQueryResult<InfiniteData<T[], unknown>, Error>
  orderedIds?: number[]
}) {
  const sortedPages = useMemo(() => {
    const pages = query.data?.pages ?? []
    if (!orderedIds?.length)
      return pages

    const order = new Map(orderedIds.map((id, index) => [id, index]))

    return pages.map(page => [...page].sort((a, b) => {
      const ai = order.get(a.id)
      const bi = order.get(b.id)
      if (ai === undefined && bi === undefined)
        return 0
      if (ai === undefined)
        return 1
      if (bi === undefined)
        return -1
      return ai - bi
    }))
  }, [query.data?.pages, orderedIds])

  const results = sortedPages.flat()

  function renderResult(result: Result) {
    switch (result.kind) {
      case 'track':
        return <TrackListing key={result.id} track={result} />
      case 'playlist':
        return <PlaylistListing key={result.id} playlist={result} />
      case 'user':
        return <UserListing key={result.id} user={result} />
      default:
        return null
    }
  }

  return (
    <>
      <QueryView
        query={query}
        content={() => (
          <>
            {results.length === 0 && (
              <span className='mt-4 text-lg text-base-900-100/25'>Nothing here...</span>
            )}

            {results.map(renderResult)}
          </>
        )}
      />

      <InfiniteQueryLoadMore query={query} />
    </>
  )
}
