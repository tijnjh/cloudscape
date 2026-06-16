import { resolveTrack } from '$lib/api/track'
import CommentsView from '$lib/components/CommentsView'
import HeroSection from '$lib/components/HeroSection'
import TrackListing from '$lib/components/listings/TrackListing'
import Main from '$lib/components/Main'
import QueryView from '$lib/components/QueryView'
import { useDocumentTitle, useFavicon } from '$lib/hooks'
import { formatDate } from '$lib/utils'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import dedent from 'dedent'

export const Route = createFileRoute('/$user/$track/')({
  component: TrackPage,
})

function TrackPage() {
  const params = useParams({ strict: false }) as { user: string, track: string }

  const trackQuery = useQuery({
    queryKey: ['track', params.user, params.track],
    queryFn: () => resolveTrack(params),
  })

  useDocumentTitle(trackQuery.data?.title)
  useFavicon(trackQuery.data?.artwork_url)

  return (
    <Main
      left={(
        <QueryView query={trackQuery}>
          {(track) => {
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
        </QueryView>
      )}
      right={(
        <QueryView query={trackQuery}>
          {track => (
            <>
              <TrackListing track={track} />

              {track.commentable && (
                <>
                  <h2 className="mt-4 text-lg font-medium">
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
        </QueryView>
      )}
    />
  )
}
