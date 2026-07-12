import type { Playlist } from '$lib/schemas/playlist'
import type { Track } from '$lib/schemas/track'
import { getUserPlaylists, getUserTracks, resolveUser } from '$lib/api/user'
import HeroSection from '$lib/components/HeroSection'
import InfiniteQueryView from '$lib/components/InfiniteQueryView'
import Main from '$lib/components/Main'
import QueryView from '$lib/components/QueryView'
import SegmentedPicker from '$lib/components/ui/SegmentedPicker'
import { max_items_per_page } from '$lib/constants'
import { useDocumentHead } from '$lib/hooks'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { match } from 'matchexpr'
import * as v from 'valibot'

const kinds = ['tracks', 'playlists'] as const

export const Route = createFileRoute('/$user')({
  validateSearch: v.object({
    kind: v.optional(v.picklist(kinds), 'tracks'),
  }),
  component: UserPage,
})

function UserPage() {
  const params = Route.useParams()
  const searchParams = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const userQuery = useQuery({
    queryKey: ['user', params.user],
    queryFn: () => resolveUser(params.user),
    enabled: !!params.user,
  })

  const userDetailsQuery = useInfiniteQuery({
    queryKey: ['user', userQuery.data?.id, searchParams.kind],
    queryFn: async ({ pageParam = 0 }) => {
      if (!userQuery.data)
        return []

      const fn = match(searchParams.kind, {
        tracks: () => getUserTracks,
        playlists: () => getUserPlaylists,
      })

      const result = await fn({
        id: userQuery.data.id,
        offset: pageParam * max_items_per_page,
        limit: max_items_per_page,
      })

      return result.collection as (Track | Playlist)[] // need to cast for some reason :P
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 0 ? undefined : allPages.length,
  })

  useDocumentHead(userQuery.data?.username, userQuery.data?.avatar_url)

  return (
    <Main
      left={(
        <QueryView
          query={userQuery}
          content={user => (
            <HeroSection
              pictureSrc={user.avatar_url}
              title={user.username}
              description={user.description}
              badges={[user.verified && 'Verified']}
              roundedPicture
            />
          )}
        />
      )}
      right={(
        <>
          <SegmentedPicker
            options={kinds}
            current={searchParams.kind}
            onChange={kind => navigate({
              search: { kind },
              replace: true,
              resetScroll: false,
            })}
          />

          <InfiniteQueryView query={userDetailsQuery} />
        </>
      )}
    />
  )
}
