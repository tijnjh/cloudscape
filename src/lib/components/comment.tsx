import type { Comment as CommentType } from '$lib/schemas/comment'
import { formatDate } from '$lib/utils'
import { Link } from '@tanstack/react-router'
import { ListingThumbnail } from './ListingThumbnail'
import { Badge } from './ui/Badge'

function formatTimestamp(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function Comment({ comment }: { comment: CommentType }) {
  return (
    <div className='flex gap-4'>
      <Link
        to='/$user'
        params={{ user: comment.user.permalink }}
        search={{ kind: 'tracks' }}
        aria-label={comment.user.username}
        className='shrink-0'
      >
        <ListingThumbnail
          src={comment.user.avatar_url}
          alt={`Profile picture of ${comment.user.permalink}`}
          className='rounded-full'
        />
      </Link>

      <div className='flex min-w-0 flex-col gap-1'>
        <div className='flex items-center gap-2'>
          <Link
            to='/$user'
            params={{ user: comment.user.permalink }}
            search={{ kind: 'tracks' }}
            className='truncate font-medium hover:underline'
          >
            {comment.user.username}
          </Link>

          {comment.timestamp != null && (
            <Badge label={`@ ${formatTimestamp(comment.timestamp)}`} />
          )}
        </div>

        <p className='wrap-break-word whitespace-pre-wrap text-base-600-400'>
          {comment.body}
        </p>

        <span className='text-sm text-accent/50'>
          {formatDate(comment.created_at)}
        </span>
      </div>
    </div>
  )
}
