import type { Playlist } from '$lib/schemas/playlist'
import type { Track } from '$lib/schemas/track'
import type { User } from '$lib/schemas/user'
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query'
import { useIntersectionCallback } from '$lib/hooks'
import { motion } from 'motion/react'
import { useMemo } from 'react'
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
  const sortedPages = useMemo(() => {
    if (!orderedIds) {
      return query.data?.pages ?? []
    }

    return query.data?.pages.map((page) => {
      if (orderedIds.length === 0)
        return page

      return [...page].sort((a, b) => {
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
    }) ?? []
  }, [orderedIds, query.data?.pages])

  const loadMoreRef = useIntersectionCallback<HTMLButtonElement>(() => {
    if (!query.isFetching) {
      return
    }

    query.fetchNextPage()
  })

  if (query.isLoading) {
    return <Spinner />
  }

  if (query.isError) {
    return <ErrorDisplay error={query.error} />
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        {sortedPages.length > 0
          ? sortedPages.map(page => (
              <div key={page.map(result => result.id).join(',') || 'empty'} className="contents">
                {page.map(result => (
                  <ResultListing key={result.id} result={result} />
                ))}
              </div>
            ))
          : !query.isLoading && (
              <span className="mt-4 text-lg text-base-100-900/25">
                Nothing here...
              </span>
            )}
      </motion.div>

      {query.hasNextPage && (
        <Button
          ref={loadMoreRef}
          className="mt-8 w-full"
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

function ResultListing({ result }: { result: Result }) {
  if (result.kind === 'track') {
    return <TrackListing track={result} />
  }

  if (result.kind === 'playlist') {
    return <PlaylistListing playlist={result} />
  }

  if (result.kind === 'user') {
    return <UserListing user={result} />
  }

  return null
}
