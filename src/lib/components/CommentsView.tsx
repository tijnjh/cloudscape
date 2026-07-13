import { getTrackComments } from '$lib/api/track'
import { max_items_per_page } from '$lib/constants'
import { useWhenInView } from '$lib/utils'
import { useInfiniteQuery } from '@tanstack/react-query'
import { match } from 'matchexpr'
import { motion, useReducedMotion } from 'motion/react'
import { useCallback } from 'react'
import Comment from './Comment'
import ErrorDisplay from './ErrorDisplay'
import Spinner from './Spinner'
import Button from './ui/Button'

export default function CommentsView({ trackId }: { trackId: number }) {
  const reduceMotion = useReducedMotion()

  const commentsQuery = useInfiniteQuery({
    queryKey: ['track-comments', trackId],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await getTrackComments({
        id: trackId,
        offset: pageParam * max_items_per_page,
        limit: max_items_per_page,
      })
      return result.collection
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 0 ? undefined : allPages.length,
  })
  const { fetchNextPage, isFetching } = commentsQuery

  const loadMore = useCallback(() => {
    if (isFetching)
      return

    fetchNextPage()
  }, [fetchNextPage, isFetching])

  const loadMoreRef = useWhenInView(loadMore)

  return (
    <>

      {match(commentsQuery, 'status', {
        pending: () => <Spinner />,
        error: () => <ErrorDisplay error={commentsQuery.error} />,
        success: () => (
          <motion.div
            initial={{ y: reduceMotion ? 0 : 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='flex flex-col gap-6'
          >
            {commentsQuery.data?.pages.flat().length === 0 && (
              <span className='mt-4 text-lg text-base-100-900/25'>No comments yet...</span>
            )}

            {commentsQuery.data?.pages.flat().map(comment => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </motion.div>
        ),
      })}

      {commentsQuery.hasNextPage && (
        <Button
          ref={loadMoreRef}
          className='mt-8 w-full'
          onClick={() => commentsQuery.fetchNextPage()}
        >
          Load more
        </Button>
      )}
    </>
  )
}
