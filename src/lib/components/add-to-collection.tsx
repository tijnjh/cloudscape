import { collectionsAtom } from '$lib/collection-atoms'
import { maxCollectionTracks } from '$lib/collections'
import { Menu } from '@base-ui/react/menu'
import { useAtom } from 'jotai'
import { CheckIcon, ListPlusIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'

export function AddToCollection({ trackId }: { trackId: number }) {
  const [collections, setCollections] = useAtom(collectionsAtom)
  const [message, setMessage] = useState('')

  return (
    <div className='flex flex-col items-start gap-2'>
      <Menu.Root>
        <Menu.Trigger render={<Button variant='secondary' icon={ListPlusIcon}>Add to collection</Button>} />
        <Menu.Portal>
          <Menu.Positioner align='start' sideOffset={8} className='z-30'>
            <Menu.Popup className='flex max-h-80 max-w-[calc(100vw-2rem)] min-w-56 flex-col gap-1 overflow-y-auto rounded-xl bg-base-300-700 p-2 shadow-xl'>
              {collections.map((collection) => {
                const added = collection.trackIds.includes(trackId)
                const full = collection.trackIds.length >= maxCollectionTracks
                return (
                  <Menu.Item
                    key={collection.id}
                    disabled={added || full}
                    className='flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left data-highlighted:bg-base-200-800 data-disabled:opacity-50'
                    onClick={() => {
                      try {
                        setCollections(current => current.map(item => item.id === collection.id && !item.trackIds.includes(trackId) && item.trackIds.length < maxCollectionTracks
                          ? { ...item, trackIds: [...item.trackIds, trackId] }
                          : item))
                        setMessage(`Added to ${collection.name}.`)
                      }
                      catch {
                        setMessage('Could not save. Check that browser storage is available and has free space.')
                      }
                    }}
                  >
                    {added && <CheckIcon size={16} className='shrink-0' />}
                    <span className='truncate'>{collection.name}</span>
                    {full && !added && <span className='text-sm'>(full)</span>}
                  </Menu.Item>
                )
              })}
              {collections.length === 0 && <p className='px-3 py-2 text-sm'>No collections yet.</p>}
              <Menu.Item render={<Button variant='secondary' href='/'>Create a collection on Home</Button>} nativeButton={false} />
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
      <p role='status' className='text-sm text-base-600-400'>{message}</p>
    </div>
  )
}
