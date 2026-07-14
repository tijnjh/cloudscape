import type { UseInfiniteQueryResult } from '@tanstack/react-query'
import { useWhenInView } from '$lib/utils'
import { useCallback } from 'react'
import { Button } from './ui/Button'

export function InfiniteQueryLoadMore<T>({
  query,
}: {
  query: Pick<
    UseInfiniteQueryResult<T>,
    'fetchNextPage' | 'hasNextPage' | 'isFetching'
  >
}) {
  const { fetchNextPage, hasNextPage, isFetching } = query
  const loadMore = useCallback(() => {
    if (isFetching)
      return

    void fetchNextPage()
  }, [fetchNextPage, isFetching])
  const loadMoreRef = useWhenInView(loadMore)

  if (!hasNextPage)
    return null

  return (
    <Button ref={loadMoreRef} className='mt-8 w-full' onClick={loadMore}>
      Load more
    </Button>
  )
}
