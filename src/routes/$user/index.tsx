import type { Playlist } from '$lib/schemas/playlist'
import type { Track } from '$lib/schemas/track'
import { getUserPlaylists, getUserTracks, resolveUser } from '$lib/api/user'
import HeroSection from '$lib/components/HeroSection'
import InfiniteQueryView from '$lib/components/InfiniteQueryView'
import Main from '$lib/components/Main'
import QueryView from '$lib/components/QueryView'
import SegmentedPicker from '$lib/components/ui/SegmentedPicker'
import { max_items_per_page } from '$lib/constants'
import { useDocumentTitle, useFavicon, useStableSearchValue } from '$lib/hooks'
import { match } from '$lib/utils/match'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useParams, useSearch } from '@tanstack/react-router'

const userKinds = ['tracks', 'playlists'] as const

export const Route = createFileRoute('/$user/')({
  component: UserPage,
})

function UserPage() {
  const params = useParams({ strict: false }) as { user: string }
  const search = useSearch({ strict: false }) as Record<string, unknown>
  const navigate = useNavigate()
  const kind = useStableSearchValue(search.kind, 'tracks', userKinds)

  const userQuery = useQuery({
    queryKey: ['user', params.user],
    queryFn: () => resolveUser(params.user),
    enabled: !!params.user,
  })

  const userDetailsQuery = useInfiniteQuery({
    queryKey: ['user', userQuery.data?.id, kind],
    queryFn: async ({ pageParam = 0 }) => {
      if (!userQuery.data)
        return []

      const fn = match(kind, {
        tracks: () => getUserTracks,
        playlists: () => getUserPlaylists,
      })

      const result = await fn({
        id: userQuery.data.id,
        offset: pageParam * max_items_per_page,
        limit: max_items_per_page,
      })

      return result.collection as (Track | Playlist)[]
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 0 ? undefined : allPages.length,
  })

  useDocumentTitle(userQuery.data?.username)
  useFavicon(userQuery.data?.avatar_url)

  return (
    <Main
      left={(
        <QueryView query={userQuery}>
          {user => (
            <HeroSection
              pictureSrc={user.avatar_url}
              title={user.username}
              description={user.description}
              badges={[user.verified && 'Verified']}
              roundedPicture
            />
          )}
        </QueryView>
      )}
      right={(
        <>
          <SegmentedPicker
            options={userKinds}
            current={kind}
            onChange={(value) => {
              navigate({
                search: (previous: Record<string, unknown>) => ({ ...previous, kind: value }),
                replace: true,
              } as never)
            }}
          />

          <InfiniteQueryView query={userDetailsQuery} />
        </>
      )}
    />
  )
}
