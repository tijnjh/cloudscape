import { collectionsAtom } from '$lib/collection-atoms'
import { createCollection } from '$lib/collections'
import { useNavigate } from '@tanstack/react-router'
import { useSetAtom } from 'jotai'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { CollectionNameDialog } from './collection-name-dialog'
import { Button } from './ui/button'

export function CreateCollectionButton() {
  const [open, setOpen] = useState(false)
  const setCollections = useSetAtom(collectionsAtom)
  const navigate = useNavigate()

  return (
    <>
      <Button variant='secondary' icon={PlusIcon} onClick={() => setOpen(true)}>Create collection</Button>
      <CollectionNameDialog
        open={open}
        onOpenChange={setOpen}
        title='Create collection'
        onSave={(name) => {
          const collection = createCollection(name)
          setCollections(current => [...current, collection])
          void navigate({ to: '/_/collections/$collectionId', params: { collectionId: collection.id } })
        }}
      />
    </>
  )
}
