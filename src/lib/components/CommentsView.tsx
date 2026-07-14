import { getTrackComments } from '$lib/api/track'
import { max_items_per_page } from '$lib/constants'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Comment } from './Comment'
import { InfiniteQueryLoadMore } from './InfiniteQueryLoadMore'
import { QueryView } from './QueryView'

export function CommentsView({ trackId }: { trackId: number }) {
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

  return (
    <>
      <QueryView
        query={commentsQuery}
        className='gap-6'
        content={(data) => {
          const comments = data.pages.flat()

          return (
            <>
              {comments.length === 0 && (
                <span className='mt-4 text-lg text-base-100-900/25'>No comments yet...</span>
              )}

              {comments.map(comment => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </>
          )
        }}
      />

      <InfiniteQueryLoadMore query={commentsQuery} />
    </>
  )
}
