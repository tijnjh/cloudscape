import type { Sc } from '$lib/types/soundcloud'
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query'
import { match } from 'matchexpr'
import { useMemo } from 'react'
import { InfiniteQueryLoadMore } from './infinite-query-load-more'
import { PlaylistListing } from './listings/playlist-listing'
import { TrackListing } from './listings/track-listing'
import { UserListing } from './listings/user-listing'
import { QueryView } from './query-view'

type Result
  = | (Sc.Track & { kind: 'track' })
    | (Sc.Playlist & { kind: 'playlist' })
    | (Sc.User & { kind: 'user' })

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
      const ai = order.get(a.id as number)
      const bi = order.get(b.id as number)
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

  const renderResult = (result: Result) => match(result, 'kind', {
    track: result => <TrackListing key={result.id} track={result} />,
    playlist: result => <PlaylistListing key={result.id} playlist={result} />,
    user: result => <UserListing key={result.id} user={result} />,
  })

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
