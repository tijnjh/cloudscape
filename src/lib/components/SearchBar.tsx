import type { InputProps as InputPrimitiveProps } from '@base-ui/react/input'
import { useNavigate } from '@tanstack/react-router'
import { SearchIcon } from 'lucide-react'
import { useState } from 'react'
import Input from './ui/Input'

export default function SearchBar({ value, onChange }: InputPrimitiveProps) {
  const navigate = useNavigate()

  const [query, setQuery] = useState<string>(String(value) ?? '')

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
        onChange={(e) => {
          setQuery(e.currentTarget.value)
          onChange?.(e)
        }}
      />
    </form>
  )
}
