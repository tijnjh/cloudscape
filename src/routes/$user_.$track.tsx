import { resolveTrack } from '$lib/api/track'
import BlockedTrackNotice from '$lib/components/BlockedTrackNotice'
import CommentsView from '$lib/components/CommentsView'
import HeroSection from '$lib/components/HeroSection'
import TrackListing from '$lib/components/listings/TrackListing'
import Main from '$lib/components/Main'
import QueryView from '$lib/components/QueryView'
import { useDocumentHead } from '$lib/hooks'
import { formatDate } from '$lib/utils'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import dedent from 'dedent'

export const Route = createFileRoute('/$user_/$track')({
  component: TrackPage,
})

function TrackPage() {
  const params = Route.useParams()

  const trackQuery = useQuery({
    queryKey: ['track', params.user, params.track],
    queryFn: () => resolveTrack(params),
  })

  useDocumentHead(
    trackQuery.data?.title,
    trackQuery.data?.artwork_url,
  )

  return (
    <Main
      left={(
        <QueryView
          query={trackQuery}
          content={(track) => {
            const releaseDate = formatDate(track.release_date)

            return (
              <HeroSection
                pictureSrc={track.artwork_url}
                title={track.title}
                user={track.user}
                description={dedent`${track.genre}
                  ${releaseDate ?? ''}
                  ${track.label_name}`.trim()}
              />
            )
          }}
        />
      )}
      right={(
        <QueryView
          query={trackQuery}
          content={track => (
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
                  <CommentsView trackId={track.id} />
                </>
              )}
            </>
          )}
        />
      )}
    />
  )
}
