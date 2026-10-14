import type { CollectionContent, LocalCollection } from '$lib/collections'
import { getTracksByIds } from '$lib/api/track'
import { selectedInstanceAtom } from '$lib/atoms'
import { collectionsAtom } from '$lib/collection-atoms'
import { collectionShareUrl, createCollection, moveCollectionTrack } from '$lib/collections'
import { max_items_per_page } from '$lib/constants'
import { useDocumentHead } from '$lib/hooks'
import { Dialog } from '@base-ui/react/dialog'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useAtomValue, useSetAtom } from 'jotai'
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, PencilIcon, SaveIcon, Share2Icon, Trash2Icon, XIcon } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { CollectionNameDialog } from './collection-name-dialog'
import { TrackListing } from './listings/track-listing'
import { Main } from './main'
import { QueryView } from './query-view'
import { AnimatedDialog } from './ui/animated-dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'

export function CollectionView({ collection, localId }: { collection: CollectionContent, localId?: string }) {
  const setCollections = useSetAtom(collectionsAtom)
  const selectedInstance = useAtomValue(selectedInstanceAtom)
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [isEditing, setIsEditing] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  // Fetch in API-sized batches, independently of the display order.
  const sortedIds = [...collection.trackIds].sort((a, b) => a - b)
  const query = useQuery({
    queryKey: ['collection-tracks', selectedInstance, sortedIds],
    queryFn: async () => {
      const batches = []
      for (let i = 0; i < sortedIds.length; i += max_items_per_page)
        batches.push(getTracksByIds(sortedIds.slice(i, i + max_items_per_page)))
      return (await Promise.all(batches)).flat()
    },
    enabled: Boolean(selectedInstance) && sortedIds.length > 0,
  })

  useDocumentHead(collection.name)

  function updateCollection(update: (current: LocalCollection) => LocalCollection) {
    setCollections(current => current.map(item => item.id === localId ? update(item) : item))
    setShareUrl('')
    setMessage('')
    setError('')
  }

  function editTracks(update: (ids: number[]) => number[]) {
    try {
      updateCollection(current => ({ ...current, trackIds: update(current.trackIds) }))
    }
    catch {
      setError('Could not save your changes. Check that browser storage is available and has free space.')
    }
  }

  async function share() {
    try {
      const url = collectionShareUrl(collection, window.location.origin)
      setShareUrl(url)
      setError('')
      setMessage('Copy the link below to share this collection.')
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url)
        setMessage('Collection link copied.')
      }
    }
    catch {
      setMessage('Copy the link below to share this collection.')
    }
  }

  return (
    <Main
      left={(
        <>
          <p className='text-sm text-base-600-400'>{localId ? 'Your collection' : 'Shared collection'}</p>
          <h1 className='text-3xl font-medium wrap-anywhere'>{collection.name}</h1>
          <p className='text-base-600-400'>
            {collection.trackIds.length}
            {' '}
            {collection.trackIds.length === 1 ? 'track' : 'tracks'}
            {' · '}
            {localId ? 'Saved in this browser' : 'Save a copy to edit it in this browser'}
          </p>
          <div className='flex flex-wrap gap-2'>
            <Button icon={Share2Icon} onClick={() => void share()}>Share</Button>
            {localId
              ? (
                  <>
                    <Button
                      variant='secondary'
                      icon={isEditing ? CheckIcon : PencilIcon}
                      aria-pressed={isEditing}
                      onClick={() => setIsEditing(current => !current)}
                    >
                      {isEditing ? 'Done' : 'Edit'}
                    </Button>
                    {isEditing && (
                      <>
                        <Button variant='secondary' icon={PencilIcon} onClick={() => setRenaming(true)}>Rename</Button>
                        <Button
                          variant='secondary'
                          icon={Trash2Icon}
                          onClick={() => setDeleting(true)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </>
                )
              : (
                  <Button
                    variant='secondary'
                    icon={SaveIcon}
                    onClick={() => {
                      try {
                        const saved = createCollection(collection.name, collection.trackIds)
                        setCollections(current => [...current, saved])
                        void navigate({ to: '/_/collections/$collectionId', params: { collectionId: saved.id } })
                      }
                      catch {
                        setError('Could not save this collection. Check that browser storage is available and has free space.')
                      }
                    }}
                  >
                    Save a copy
                  </Button>
                )}
          </div>
          {shareUrl && (
            <label className='flex min-w-0 flex-col gap-2 text-sm'>
              Collection link
              <Input value={shareUrl} readOnly onFocus={event => event.target.select()} />
              <span className='text-base-600-400'>This link contains a copy. Later edits won’t change it.</span>
            </label>
          )}
          <p role='status' className='text-sm text-base-600-400'>{message}</p>
          {error && <p role='alert'>{error}</p>}
          <CollectionNameDialog
            open={renaming}
            onOpenChange={setRenaming}
            title='Rename collection'
            initialName={collection.name}
            onSave={name => updateCollection(current => ({ ...current, name }))}
          />
          <AnimatedDialog open={deleting} onOpenChange={setDeleting}>
            <Dialog.Title className='text-2xl font-medium'>Delete collection?</Dialog.Title>
            <Dialog.Description className='mt-2 wrap-anywhere'>
              Delete “
              {collection.name}
              ” from this browser? Previously shared links will still work.
            </Dialog.Description>
            <div className='mt-4 flex justify-end gap-2'>
              <Button variant='secondary' onClick={() => setDeleting(false)}>Cancel</Button>
              <Button onClick={() => {
                try {
                  setCollections(current => current.filter(item => item.id !== localId))
                  void navigate({ to: '/' })
                }
                catch {
                  setDeleting(false)
                  setError('Could not delete this collection. Check that browser storage is available.')
                }
              }}
              >
                Delete collection
              </Button>
            </div>
          </AnimatedDialog>
        </>
      )}
      right={(
        <>
          {collection.trackIds.length === 0
            ? <p className='text-base-600-400'>This collection is empty. Open a track’s options menu and choose “Add to collection” to get started.</p>
            : !selectedInstance
                ? (
                    <div className='flex flex-col items-start gap-2'>
                      <p>Choose an instance to load and play these tracks.</p>
                      <Button variant='secondary' href='/_/preferences/instance'>Choose instance</Button>
                    </div>
                  )
                : (
                    <>
                      <QueryView
                        query={query}
                        content={(tracks) => {
                          const tracksById = new Map(tracks.map(track => [track.id, track]))
                          return (
                            <ol className='flex flex-col gap-6'>
                              {collection.trackIds.map((id, index) => {
                                const track = tracksById.get(id)
                                const label = track?.title ?? `Track ${id}`
                                return (
                                  <li key={id} className='flex min-w-0 flex-col'>
                                    {track
                                      ? <TrackListing track={track} />
                                      : (
                                          <p className='text-base-600-400'>
                                            {label}
                                            {' · Unavailable'}
                                          </p>
                                        )}
                                    <AnimatePresence initial={false}>
                                      {localId && isEditing && (
                                        <motion.div
                                          key='edit-controls'
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: 'auto', opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeInOut' }}
                                          className='overflow-hidden'
                                        >
                                          <div className='flex items-center gap-2 pt-2'>
                                            <span className='mr-auto text-sm text-base-600-400'>
                                              {index + 1}
                                              {' / '}
                                              {collection.trackIds.length}
                                            </span>
                                            <Button variant='secondary' size='icon' icon={ArrowUpIcon} aria-label={`Move ${label} up`} disabled={index === 0} onClick={() => editTracks(ids => moveCollectionTrack(ids, id, -1))} />
                                            <Button variant='secondary' size='icon' icon={ArrowDownIcon} aria-label={`Move ${label} down`} disabled={index === collection.trackIds.length - 1} onClick={() => editTracks(ids => moveCollectionTrack(ids, id, 1))} />
                                            <Button variant='secondary' size='icon' icon={XIcon} aria-label={`Remove ${label} from collection`} onClick={() => editTracks(ids => ids.filter(trackId => trackId !== id))} />
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </li>
                                )
                              })}
                            </ol>
                          )
                        }}
                      />
                      {query.isError && (
                        <Button variant='secondary' onClick={() => void query.refetch()}>Retry loading tracks</Button>
                      )}
                    </>
                  )}
        </>
      )}
    />
  )
}
