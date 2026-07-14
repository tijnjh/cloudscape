import type { Playlist } from '$lib/schemas/playlist'
import type { Track } from '$lib/schemas/track'
import type { User } from '$lib/schemas/user'
import { searchAnything, searchPlaylists, searchTracks, searchUsers } from '$lib/api/search'
import { InfiniteQueryView } from '$lib/components/InfiniteQueryView'
import { Main } from '$lib/components/Main'
import { SearchBar } from '$lib/components/SearchBar'
import { SegmentedPicker } from '$lib/components/ui/SegmentedPicker'
import { max_items_per_page } from '$lib/constants'
import { useDocumentHead } from '$lib/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import * as v from 'valibot'

const kinds = ['all', 'tracks', 'playlists', 'users'] as const

export const Route = createFileRoute('/search')({
  validateSearch: v.object({
    q: v.optional(v.string(), ''),
    kind: v.optional(
      v.picklist(kinds),
      'all',
    ),
  }),
  component: SearchPage,
})

function SearchPage() {
  const searchParams = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const [debouncedQ, setDebouncedQ] = useState(searchParams.q)

  useEffect(() => {
    const timeout = setTimeout(setDebouncedQ, 250, searchParams.q)
    return () => clearTimeout(timeout)
  }, [searchParams.q])

  useDocumentHead(`results for '${debouncedQ}' - Cloudscape`)

  const searchQuery = useInfiniteQuery({
    queryKey: ['search', debouncedQ, searchParams.kind],
    queryFn: async ({ pageParam }): Promise<(Track | Playlist | User)[]> => {
      if (!debouncedQ)
        return []

      const params = {
        query: debouncedQ,
        offset: pageParam * max_items_per_page,
        limit: max_items_per_page,
      }

      switch (searchParams.kind) {
        case 'tracks':
          return (await searchTracks(params)).collection
        case 'playlists':
          return (await searchPlaylists(params)).collection
        case 'users':
          return (await searchUsers(params)).collection
        case 'all':
          return (await searchAnything(params)).collection
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < max_items_per_page ? undefined : allPages.length,
  })

  function updateSearch(next: Partial<typeof searchParams>) {
    navigate({
      search: previous => ({ ...previous, ...next }),
      replace: true,
      resetScroll: false,
    })
  }

  return (
    <Main
      left={(
        <SearchBar key={searchParams.q} value={searchParams.q} />
      )}
      right={(
        <>
          <SegmentedPicker
            options={kinds}
            current={searchParams.kind}
            onChange={kind => updateSearch({ kind })}
          />
          <InfiniteQueryView query={searchQuery} />
        </>
      )}
    />
  )
}
