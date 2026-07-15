import { getSearchSuggestions } from '$lib/api/discovery'
import { Autocomplete } from '@base-ui/react/autocomplete'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { SearchIcon, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function SearchBar({ value = '' }: { value?: string }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState(value)
  const [debouncedQuery, setDebouncedQuery] = useState(value.trim())

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query.trim()), 250)
    return () => clearTimeout(timeout)
  }, [query])

  const suggestionsQuery = useQuery({
    queryKey: ['search-suggestions', debouncedQuery],
    queryFn: ({ signal }) => getSearchSuggestions(debouncedQuery, signal),
    enabled: Boolean(debouncedQuery),
  })

  const isWaiting = Boolean(query.trim()) && query.trim() !== debouncedQuery
  const suggestions = isWaiting
    ? []
    : suggestionsQuery.data?.collection ?? []

  function search(nextQuery: string) {
    navigate({
      to: '/search',
      search: { q: nextQuery },
    })
  }

  return (
    <form
      className='w-full'
      onSubmit={(e) => {
        e.preventDefault()
        search(query)
      }}
    >
      <Autocomplete.Root
        items={suggestions}
        value={query}
        onValueChange={setQuery}
        itemToStringValue={suggestion => suggestion.query}
        filter={null}
      >
        <Autocomplete.InputGroup
          className='relative flex h-10 w-full items-center gap-2 overflow-clip rounded-full bg-base-300-700 pl-4 ring-blue-500 focus-within:ring-2'
        >
          <SearchIcon size={16} strokeWidth={3} className='shrink-0' aria-hidden />

          <Autocomplete.Input
            type='search'
            name='q'
            placeholder='Search for artists, tracks or playlists...'
            className='h-full grow outline-none'
            id='search-input'
            aria-label='Search for artists, tracks or playlists'
            autoComplete='off'
          />

          <Autocomplete.Clear
            className='mr-2 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent text-base-200-800 transition-transform duration-150 ease-out hover:opacity-80 active:scale-97 active:opacity-50'
            aria-label='Clear search'
          >
            <XIcon size={12} strokeWidth={3} />
          </Autocomplete.Clear>
        </Autocomplete.InputGroup>

        <Autocomplete.Portal>
          <Autocomplete.Positioner
            align='start'
            sideOffset={8}
            className='z-1000 outline-hidden'
          >
            <Autocomplete.Popup
              className='w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) overflow-clip rounded-2xl bg-base-300-700 text-base-900-100 shadow-lg transition-[scale,opacity] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0'
            >
              <Autocomplete.Empty>
                <div className='px-4 py-3 text-sm text-base-900-100/50'>
                  {isWaiting || suggestionsQuery.isFetching
                    ? 'Searching...'
                    : suggestionsQuery.isError
                      ? 'Could not load suggestions.'
                      : 'No suggestions found.'}
                </div>
              </Autocomplete.Empty>

              <Autocomplete.List className='max-h-[min(22.5rem,var(--available-height))] overflow-y-auto overscroll-contain p-1 outline-none data-empty:p-0'>
                {(suggestion: (typeof suggestions)[number]) => (
                  <Autocomplete.Item
                    key={suggestion.query}
                    value={suggestion}
                    className='cursor-default rounded-xl px-3 py-2 outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-base-200-800'
                    onClick={() => search(suggestion.query)}
                  >
                    {suggestion.query}
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
    </form>
  )
}
