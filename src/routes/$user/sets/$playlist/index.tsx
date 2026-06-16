import { resolvePlaylist } from '$lib/api/playlist'
import { getTracksByIds } from '$lib/api/track'
import HeroSection from '$lib/components/HeroSection'
import InfiniteQueryView from '$lib/components/InfiniteQueryView'
import Main from '$lib/components/Main'
import QueryView from '$lib/components/QueryView'
import { max_items_per_page } from '$lib/constants'
import { useDocumentTitle, useFavicon } from '$lib/hooks'
import { formatDate } from '$lib/utils'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import dedent from 'dedent'

export const Route = createFileRoute('/$user/sets/$playlist/')({
  component: PlaylistPage,
})

function PlaylistPage() {
  const params = useParams({ strict: false }) as { user: string, playlist: string }

  const playlistQuery = useQuery({
    queryKey: ['playlist', params.user, params.playlist],
    queryFn: () => resolvePlaylist(params),
  })

  const playlistTracksQuery = useInfiniteQuery({
    queryKey: ['playlist-tracks', playlistQuery.data?.id],
    queryFn: ({ pageParam = 0 }) => {
      const allIds = playlistQuery.data?.tracks?.map(track => track.id) ?? []

      const startIdx = pageParam * max_items_per_page
      const endIdx = startIdx + max_items_per_page
      const idsChunk = allIds.slice(startIdx, endIdx)

      return getTracksByIds(idsChunk)
    },
    initialPageParam: 0,
    getNextPageParam: (_, allPages) => {
      const allIds = playlistQuery.data?.tracks?.map(track => track.id) ?? []
      const totalChunks = Math.ceil(allIds.length / max_items_per_page)

      return allPages.length < totalChunks ? allPages.length : undefined
    },
  })

  useDocumentTitle(playlistQuery.data?.title)
  useFavicon(playlistQuery.data?.artwork_url)

  return (
    <Main
      left={(
        <QueryView query={playlistQuery}>
          {(playlist) => {
            const releaseDate = playlist.release_date
              ? formatDate(playlist.release_date)
              : undefined

            return (
              <HeroSection
                pictureSrc={playlist.artwork_url}
                title={playlist.title}
                user={playlist.user}
                description={dedent`${playlist.track_count} tracks
                  ${releaseDate ?? ''}
                  ${playlist.label_name ?? ''}`.trim()}
              />
            )
          }}
        </QueryView>
      )}
      right={(
        <InfiniteQueryView
          query={playlistTracksQuery}
          orderedIds={playlistQuery.data?.tracks?.map(track => track.id)}
        />
      )}
    />
  )
}
