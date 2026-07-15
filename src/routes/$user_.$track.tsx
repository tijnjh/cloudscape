import { getTrackComments, resolveTrack } from '$lib/api/track'
import { BlockedTrackNotice } from '$lib/components/BlockedTrackNotice'
import { CommentsView } from '$lib/components/CommentsView'
import { HeroSection } from '$lib/components/HeroSection'
import { TrackListing } from '$lib/components/listings/TrackListing'
import { Main } from '$lib/components/Main'
import { max_items_per_page } from '$lib/constants'
import { useDocumentHead } from '$lib/hooks'
import { formatDate } from '$lib/utils'
import { useInfiniteQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import dedent from 'dedent'

export const Route = createFileRoute('/$user_/$track')({
  component: TrackPage,

  loader: async ({ params }) => {
    const track = await resolveTrack(params)

    return { track }
  },
})

function TrackPage() {
  const { track } = Route.useLoaderData()

  const commentsQuery = useInfiniteQuery({
    queryKey: ['track-comments', track.id],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await getTrackComments({
        id: track.id,
        offset: pageParam * max_items_per_page,
        limit: max_items_per_page,
      })
      return result.collection
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 0 ? undefined : allPages.length,
    enabled: track.commentable,
  })

  const releaseDate = formatDate(track.release_date)

  useDocumentHead(
    track.title,
    track.artwork_url,
  )

  return (
    <Main
      left={(
        <HeroSection
          pictureSrc={track.artwork_url}
          title={track.title}
          user={track.user}
          description={dedent`${track.genre}
                  ${releaseDate ?? ''}
                  ${track.label_name}`.trim()}
        />
      )}
      right={(

        <>
          {track.policy === 'BLOCK' && <BlockedTrackNotice />}

          <TrackListing track={track} />

          {track.commentable && (
            <>
              <h2 className='mt-4 text-lg font-medium'>
                Comments
                {track.comment_count != null
                  ? ` (${track.comment_count})`
                  : ''}
              </h2>
              <CommentsView query={commentsQuery} />
            </>
          )}
        </>

      )}
    />
  )
}
