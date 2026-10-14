import { decodeCollection } from '$lib/collections'
import { CollectionView } from '$lib/components/collection-view'
import { Main } from '$lib/components/main'
import { Button } from '$lib/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_/collections')({
  validateSearch: (search: Record<string, unknown>): { c?: string } => ({
    c: typeof search.c === 'string' ? search.c : undefined,
  }),
  component: SharedCollectionPage,
})

function SharedCollectionPage() {
  const { c } = Route.useSearch()
  const collection = readSharedCollection(c)
  if (collection)
    return <CollectionView key={c} collection={collection} />

  return (
    <Main>
      <h1 className='text-2xl font-medium'>Unable to open collection</h1>
      <p role='alert'>This collection link is invalid or incomplete. Ask the sender for a new link.</p>
      <Button variant='secondary' href='/'>Your collections</Button>
    </Main>
  )
}

function readSharedCollection(c?: string) {
  try {
    return decodeCollection(c ?? '')
  }
  catch {
    return null
  }
}
