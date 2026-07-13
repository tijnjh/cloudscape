import { LoaderCircleIcon } from 'lucide-react'

export function Spinner() {
  return (
    <LoaderCircleIcon
      className='mx-auto mt-16 size-9 animate-spin rounded-full text-accent/50'
    />
  )
}
