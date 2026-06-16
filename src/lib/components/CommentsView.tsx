import { getTrackComments } from '$lib/api/track'
import { max_items_per_page } from '$lib/constants'
import { useIntersectionCallback } from '$lib/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import Comment from './Comment'
import ErrorDisplay from './ErrorDisplay'
import Spinner from './Spinner'
import Button from './ui/Button'

export default function CommentsView({ trackId }: { trackId: number }) {
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

  const loadMoreRef = useIntersectionCallback<HTMLButtonElement>(() => {
    if (commentsQuery.isFetching) {
      return
    }

    commentsQuery.fetchNextPage()
  })

  if (commentsQuery.isLoading) {
    return <Spinner />
  }

  if (commentsQuery.isError) {
    return <ErrorDisplay error={commentsQuery.error} />
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        {(commentsQuery.data?.pages ?? []).length > 0
          ? commentsQuery.data?.pages.map(page => (
              <div key={page.map(comment => comment.id).join(',') || 'empty'} className="contents">
                {page.map(comment => (
                  <Comment key={comment.id} comment={comment} />
                ))}
              </div>
            ))
          : (
              <span className="mt-4 text-lg text-base-100-900/25">
                No comments yet...
              </span>
            )}
      </motion.div>

      {commentsQuery.hasNextPage && (
        <Button
          ref={loadMoreRef}
          className="mt-8 w-full"
          onClick={() => {
            commentsQuery.fetchNextPage()
          }}
        >
          Load more
        </Button>
      )}
    </>
  )
}
