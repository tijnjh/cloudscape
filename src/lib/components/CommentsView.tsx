import type { Comment as CommentData } from '$lib/schemas/comment'
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query'
import { Comment } from './Comment'
import { InfiniteQueryLoadMore } from './InfiniteQueryLoadMore'
import { QueryView } from './QueryView'

export function CommentsView({
  query,
}: {
  query: UseInfiniteQueryResult<InfiniteData<CommentData[], unknown>, Error>
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
                <span className='mt-4 text-lg text-base-100-900/25'>No comments yet...</span>
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
