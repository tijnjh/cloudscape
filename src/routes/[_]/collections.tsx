import { collectionsAtom } from '$lib/atoms'
import { decodeCollection } from '$lib/collections'
import { CollectionView } from '$lib/components/collection-view'
import { ErrorDisplay } from '$lib/components/error-display'
import { Main } from '$lib/components/main'
import { Button } from '$lib/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'

export const Route = createFileRoute('/_/collections')({
  validateSearch: (search: Record<string, unknown>): { id?: string, c?: string } => ({
    id: typeof search.id === 'string' ? search.id : undefined,
    c: typeof search.c === 'string' ? search.c : undefined,
  }),
  component: CollectionPage,
  errorComponent: ({ error }) => (
    <Main>
      <ErrorDisplay error={error} />
      <Button href='/'>Home</Button>
    </Main>
  ),
})

function CollectionPage() {
  const { id, c } = Route.useSearch()
  const collections = useAtomValue(collectionsAtom)
  const collection = c !== undefined ? decodeCollection(c) : collections.find(item => item.id === id)
  if (!collection)
    throw new Error('This collection is not saved in this browser.')

  return <CollectionView key={c ?? id} collection={collection} localId={c !== undefined ? undefined : id} />
}
