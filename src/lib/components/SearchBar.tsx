import { SearchIcon } from 'lucide-react'
import { useState } from 'react'
import Input from './ui/Input'

export default function SearchBar({ value = '' }: { value?: string }) {
  const [currentValue, setCurrentValue] = useState(value)

  return (
    <form action="/search" className="w-full">
      <Input
        type="text"
        name="q"
        placeholder="Search for artists, tracks or playlists..."
        className="w-full"
        id="search-input"
        icon={SearchIcon}
        value={currentValue}
        onValueChange={setCurrentValue}
      />
    </form>
  )
}
