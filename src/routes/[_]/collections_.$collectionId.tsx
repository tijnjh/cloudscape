import { collectionsAtom } from '$lib/collection-atoms'
import { CollectionView } from '$lib/components/collection-view'
import { Main } from '$lib/components/main'
import { Button } from '$lib/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'

export const Route = createFileRoute('/_/collections_/$collectionId')({
  component: LocalCollectionPage,
})

function LocalCollectionPage() {
  const { collectionId } = Route.useParams()
  const collections = useAtomValue(collectionsAtom)
  const collection = collections.find(item => item.id === collectionId)

  if (!collection) {
    return (
      <Main>
        <h1 className='text-2xl font-medium'>Collection not found</h1>
        <p>This collection isn’t saved in this browser. To send a collection to someone else, use its Share button.</p>
        <Button variant='secondary' href='/'>Your collections</Button>
      </Main>
    )
  }

  return <CollectionView key={collection.id} collection={collection} localId={collection.id} />
}
