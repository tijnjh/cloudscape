import { searchAnything, searchPlaylists, searchTracks, searchUsers } from '$lib/api/search'
import InfiniteQueryView from '$lib/components/InfiniteQueryView'
import Main from '$lib/components/Main'
import SearchBar from '$lib/components/SearchBar'
import SegmentedPicker from '$lib/components/ui/SegmentedPicker'
import { max_items_per_page } from '$lib/constants'
import { useDebouncedValue, useDocumentTitle, useStableSearchValue } from '$lib/hooks'
import { match } from '$lib/utils/match'
import { useInfiniteQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'

const searchKinds = ['all', 'tracks', 'playlists', 'users'] as const

export const Route = createFileRoute('/search/')({
  component: SearchPage,
})

function SearchPage() {
  const search = useSearch({ strict: false }) as Record<string, unknown>
  const navigate = useNavigate()
  const q = typeof search.q === 'string' ? search.q : ''
  const kind = useStableSearchValue(search.kind, 'all', searchKinds)
  const debouncedQ = useDebouncedValue(q)

  const searchQuery = useInfiniteQuery({
    queryKey: ['search', debouncedQ, kind],
    queryFn: async ({ pageParam = 0 }) => {
      if (!debouncedQ)
        return []

      const fn = match(kind, {
        tracks: () => searchTracks,
        playlists: () => searchPlaylists,
        users: () => searchUsers,
        all: () => searchAnything,
      })

      const result = await fn({
        query: debouncedQ,
        offset: pageParam * max_items_per_page,
        limit: max_items_per_page,
      })

      return result.collection
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < max_items_per_page ? allPages.length : undefined,
  })

  useDocumentTitle(`results for '${debouncedQ}' - Cloudscape`)

  return (
    <Main
      left={<SearchBar key={q} value={q} />}
      right={(
        <>
          <SegmentedPicker
            options={searchKinds}
            current={kind}
            onChange={(value) => {
              navigate({
                search: (previous: Record<string, unknown>) => ({ ...previous, kind: value }),
                replace: true,
              } as never)
            }}
          />
          <InfiniteQueryView query={searchQuery} />
        </>
      )}
    />
  )
}
