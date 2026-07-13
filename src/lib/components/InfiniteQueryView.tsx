import type { Playlist } from '$lib/schemas/playlist'
import type { Track } from '$lib/schemas/track'
import type { User } from '$lib/schemas/user'
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query'
import { useWhenInView } from '$lib/utils'
import { match } from 'matchexpr'
import { motion, useReducedMotion } from 'motion/react'
import { useCallback, useMemo } from 'react'
import ErrorDisplay from './ErrorDisplay'
import PlaylistListing from './listings/PlaylistListing'
import TrackListing from './listings/TrackListing'
import UserListing from './listings/UserListing'
import Spinner from './Spinner'
import Button from './ui/Button'

type Result = Track | Playlist | User

export default function InfiniteQueryView<T extends Result>({
  query,
  orderedIds,
}: {
  query: UseInfiniteQueryResult<InfiniteData<T[], unknown>, Error>
  orderedIds?: number[]
}) {
  const reduceMotion = useReducedMotion()
  const { fetchNextPage, isFetching } = query

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

  const loadMore = useCallback(() => {
    if (isFetching)
      return

    fetchNextPage()
  }, [fetchNextPage, isFetching])

  const loadMoreRef = useWhenInView(loadMore)

  return (
    <>
      {match(query, 'status', {
        pending: () => <Spinner />,
        error: () => <ErrorDisplay error={query.error} />,
        success: () => (
          <motion.div
            initial={{ y: reduceMotion ? 0 : 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='flex flex-col gap-4'
          >
            {sortedPages?.length === 0 && (
              <span className='mt-4 text-lg text-base-100-900/25'>Nothing here...</span>
            )}

            {sortedPages?.flatMap(page => page).map(renderResult)}
          </motion.div>
        ),
      })}

      {query.hasNextPage && (
        <Button
          ref={loadMoreRef}
          className='mt-8 w-full'
          onClick={() => {
            query.fetchNextPage()
          }}
        >
          Load more
        </Button>
      )}
    </>
  )
}
