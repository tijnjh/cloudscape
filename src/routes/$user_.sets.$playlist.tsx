import { resolvePlaylist } from '$lib/api/playlist'
import { getTracksByIds } from '$lib/api/track'
import HeroSection from '$lib/components/HeroSection'
import InfiniteQueryView from '$lib/components/InfiniteQueryView'
import Main from '$lib/components/Main'
import { max_items_per_page } from '$lib/constants'
import { useDocumentHead } from '$lib/hooks'
import { formatDate } from '$lib/utils'
import { useInfiniteQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import dedent from 'dedent'

export const Route = createFileRoute('/$user_/sets/$playlist')({
  component: PlaylistPage,

  loader: async ({ params }) => {
    const playlist = await resolvePlaylist({
      user: params.user,
      playlist: params.playlist,
    })

    return { playlist }
  },
})

function PlaylistPage() {
  const { playlist } = Route.useLoaderData()

  const playlistTracksQuery = useInfiniteQuery({
    queryKey: ['playlist-tracks', playlist.id],
    queryFn: ({ pageParam = 0 }) => {
      const allIds = playlist.tracks?.map(track => track.id) ?? []

      const startIdx = pageParam * max_items_per_page
      const endIdx = startIdx + max_items_per_page
      const idsChunk = allIds.slice(startIdx, endIdx)

      return getTracksByIds(idsChunk)
    },
    initialPageParam: 0,
    getNextPageParam: (_, allPages) => {
      const allIds = playlist.tracks?.map(track => track.id) ?? []
      const totalChunks = Math.ceil(allIds.length / max_items_per_page)

      return allPages.length < totalChunks ? allPages.length : undefined
    },
  })

  useDocumentHead(playlist.title, playlist.artwork_url)

  const releaseDate = playlist.release_date
    ? formatDate(playlist.release_date)
    : undefined

  return (
    <Main
      left={(
        <HeroSection
          pictureSrc={playlist.artwork_url}
          title={playlist.title}
          user={playlist.user}
          description={dedent`${playlist.track_count} tracks
                  ${releaseDate ?? ''}
                  ${playlist.label_name ?? ''}`.trim()}
        />
      )}

      right={(
        <InfiniteQueryView
          query={playlistTracksQuery}
          orderedIds={playlist?.tracks?.map(track => track.id)}
        />
      )}
    />
  )
}
