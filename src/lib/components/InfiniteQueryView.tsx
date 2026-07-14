import type { Playlist } from '$lib/schemas/playlist'
import type { Track } from '$lib/schemas/track'
import type { User } from '$lib/schemas/user'
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query'
import { match } from 'matchexpr'
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
    if (!orderedIds) {
      return query.data?.pages ?? []
    }

    return query.data?.pages.map((page) => {
      if (orderedIds.length === 0)
        return page

      return page.sort((a, b) => {
        const ai = orderedIds.indexOf(a.id)
        const bi = orderedIds.indexOf(b.id)
        if (ai === -1 && bi === -1)
          return 0
        if (ai === -1)
          return 1
        if (bi === -1)
          return -1
        return ai - bi
      })
    })
  }, [query.data?.pages, orderedIds])

  function renderResult(result: Result) {
    return match (result, 'kind', {
      track: r => <TrackListing key={result.id} track={r} />,
      playlist: r => <PlaylistListing key={result.id} playlist={r} />,
      user: r => <UserListing key={result.id} user={r} />,
    })
  }

  return (
    <>
      <QueryView
        query={query}
        content={() => (
          <>
            {sortedPages?.length === 0 && (
              <span className='mt-4 text-lg text-base-100-900/25'>Nothing here...</span>
            )}

            {sortedPages?.flatMap(page => page).map(renderResult)}
          </>
        )}
      />

      <InfiniteQueryLoadMore query={query} />
    </>
  )
}
