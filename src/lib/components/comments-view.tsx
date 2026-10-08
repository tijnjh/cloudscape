import type { Sc } from '$lib/types/soundcloud'
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query'
import { Comment } from './comment'
import { InfiniteQueryLoadMore } from './infinite-query-load-more'
import { QueryView } from './query-view'

export function CommentsView({
  query,
}: {
  query: UseInfiniteQueryResult<InfiniteData<Sc.Comment[], unknown>, Error>
}) {
  return (
    <>
      <QueryView
        query={query}
        className='gap-6'
        content={(data) => {
          const comments = data.pages.flat()

          return (
            <>
              {comments.length === 0 && (
                <span className='mt-4 text-lg text-base-900-100/25'>No comments yet...</span>
              )}

              {comments.map(comment => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </>
          )
        }}
      />

      <InfiniteQueryLoadMore query={query} />
    </>
  )
}
