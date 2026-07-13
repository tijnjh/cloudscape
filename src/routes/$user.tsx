import type { Playlist } from '$lib/schemas/playlist'
import type { Track } from '$lib/schemas/track'
import { getUserPlaylists, getUserTracks, resolveUser } from '$lib/api/user'
import { HeroSection } from '$lib/components/HeroSection'
import { InfiniteQueryView } from '$lib/components/InfiniteQueryView'
import { Main } from '$lib/components/Main'
import { SegmentedPicker } from '$lib/components/ui/SegmentedPicker'
import { max_items_per_page } from '$lib/constants'
import { useDocumentHead } from '$lib/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { match } from 'matchexpr'
import * as v from 'valibot'

const kinds = ['tracks', 'playlists'] as const

export const Route = createFileRoute('/$user')({
  validateSearch: v.object({
    kind: v.optional(v.picklist(kinds), 'tracks'),
  }),

  loader: async ({ params }) => {
    const user = await resolveUser(params.user)

    return { user }
  },

  component: UserPage,
})

function UserPage() {
  const searchParams = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const { user } = Route.useLoaderData()

  const userDetailsQuery = useInfiniteQuery({
    queryKey: ['user', user.id, searchParams.kind],
    queryFn: async ({ pageParam = 0 }) => {
      const fn = match(searchParams.kind, {
        tracks: () => getUserTracks,
        playlists: () => getUserPlaylists,
      })

      const result = await fn({
        id: user.id,
        offset: pageParam * max_items_per_page,
        limit: max_items_per_page,
      })

      return result.collection as (Track | Playlist)[] // need to cast for some reason :P
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 0 ? undefined : allPages.length,
  })

  useDocumentHead(user.username, user.avatar_url)

  return (
    <Main
      left={(
        <HeroSection
          pictureSrc={user.avatar_url}
          title={user.username}
          description={user.description}
          badges={[user.verified && 'Verified']}
          roundedPicture
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
