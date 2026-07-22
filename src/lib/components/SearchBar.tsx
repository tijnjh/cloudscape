import { Input } from '$lib/components/ui/Input'
import { useNavigate } from '@tanstack/react-router'
import { SearchIcon } from 'lucide-react'
import { useState } from 'react'

export function SearchBar({ value = '' }: { value?: string }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState(value)

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
      <Input
        icon={SearchIcon}
        type='search'
        name='q'
        placeholder='Search for artists, tracks or playlists...'
        id='search-input'
        aria-label='Search for artists, tracks or playlists'
        autoComplete='off'
        value={query}
        onChange={event => setQuery(event.target.value)}
        onClear={() => setQuery('')}
      />
    </form>
  )
}
