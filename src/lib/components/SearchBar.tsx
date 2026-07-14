import { useNavigate } from '@tanstack/react-router'
import { SearchIcon } from 'lucide-react'
import { useState } from 'react'
import { Input } from './ui/Input'

export function SearchBar({ value = '' }: { value?: string }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState(value)

  return (
    <form
      className='w-full'
      onSubmit={(e) => {
        e.preventDefault()
        navigate({
          to: '/search',
          search: { q: query },
        })
      }}
    >
      <Input
        type='search'
        name='q'
        placeholder='Search for artists, tracks or playlists...'
        className='w-full'
        id='search-input'
        icon={SearchIcon}
        value={query}
        onChange={event => setQuery(event.currentTarget.value)}
        onClear={() => setQuery('')}
      />
    </form>
  )
}
