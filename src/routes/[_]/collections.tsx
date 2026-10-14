import type { CollectionContent } from '$lib/collections'
import { getTracksByIds } from '$lib/api/track'
import { collectionsAtom, selectedInstanceAtom } from '$lib/atoms'
import { collectionShareUrl, createCollection, decodeCollection, maxCollectionNameLength, moveCollectionTrack } from '$lib/collections'
import { ErrorDisplay } from '$lib/components/error-display'
import { GenericListing } from '$lib/components/listings/generic-listing'
import { TrackListing } from '$lib/components/listings/track-listing'
import { Main } from '$lib/components/main'
import { QueryView } from '$lib/components/query-view'
import { Button } from '$lib/components/ui/button'
import { Dialog, DialogClose } from '$lib/components/ui/dialog'
import { Input } from '$lib/components/ui/input'
import { max_items_per_page } from '$lib/constants'
import { useDocumentHead } from '$lib/hooks'
import { Toast } from '@base-ui/react/toast'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAtomValue, useSetAtom } from 'jotai'
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, PencilIcon, SaveIcon, Share2Icon, Trash2Icon, XIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

export const Route = createFileRoute('/_/collections')({
  validateSearch: (search: Record<string, unknown>): { id?: string, c?: string } => ({
    id: typeof search.id === 'string' ? search.id : undefined,
    c: typeof search.c === 'string' ? search.c : undefined,
  }),
  component: CollectionPage,
  remountDeps: ({ search }) => search.c ?? search.id,
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

  const localId = c !== undefined ? undefined : id
  const setCollections = useSetAtom(collectionsAtom)
  const selectedInstance = useAtomValue(selectedInstanceAtom)
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const toast = Toast.useToastManager()
  const [isEditing, setIsEditing] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [name, setName] = useState(collection.name)
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

  function update(changes: Partial<CollectionContent>) {
    setCollections(current => current.map(item => item.id === localId ? { ...item, ...changes } : item))
  }

  function mutate(action: () => void) {
    try {
      action()
    }
    catch {
      toast.add({ title: 'Could not save collection', type: 'error' })
    }
  }

  const share = async () => {
    try {
      await navigator.clipboard.writeText(collectionShareUrl(collection, window.location.origin))
      toast.add({ id: 'collection-share', title: 'Collection link copied' })
    }
    catch {
      toast.add({ id: 'collection-share', title: 'Could not copy the link', type: 'error' })
    }
  }

  return (
    <Main
      left={(
        <>
          <h1 className='text-3xl font-medium wrap-anywhere'>{collection.name}</h1>
          <p className='text-base-600-400'>
            {`${collection.trackIds.length} ${collection.trackIds.length === 1 ? 'track' : 'tracks'} · ${localId ? 'Saved in this browser' : 'Shared collection'}`}
          </p>
          <div className='flex flex-wrap gap-2'>
            <Button icon={Share2Icon} onClick={() => void share()}>Share</Button>
            {localId
              ? (
                  <Button variant='secondary' icon={isEditing ? CheckIcon : PencilIcon} aria-pressed={isEditing} onClick={() => setIsEditing(current => !current)}>{isEditing ? 'Done' : 'Edit'}</Button>
                )
              : (
                  <Button
                    variant='secondary'
                    icon={SaveIcon}
                    onClick={() => mutate(() => {
                      const saved = createCollection(collection.name, collection.trackIds)
                      setCollections(current => [...current, saved])
                      void navigate({ to: '/_/collections', search: { id: saved.id } })
                    })}
                  >
                    Save a copy
                  </Button>
                )}
            {localId && isEditing && (
              <>
                <Dialog
                  title='Rename collection'
                  trigger={<Button variant='secondary' icon={PencilIcon}>Rename</Button>}
                  open={isRenaming}
                  onOpenChange={(open) => {
                    if (open)
                      setName(collection.name)
                    setIsRenaming(open)
                  }}
                >
                  <form
                    className='mt-4 flex flex-col gap-4'
                    onSubmit={(event) => {
                      event.preventDefault()
                      mutate(() => {
                        update({ name: name.trim() })
                        setIsRenaming(false)
                      })
                    }}
                  >
                    <Input aria-label='Collection name' value={name} onValueChange={setName} required pattern='.*\S.*' maxLength={maxCollectionNameLength} />
                    <div className='flex justify-end gap-2'>
                      <DialogClose render={<Button variant='secondary'>Cancel</Button>} />
                      <Button type='submit'>Save</Button>
                    </div>
                  </form>
                </Dialog>
                <Dialog
                  title='Delete collection?'
                  description={`Delete “${collection.name}” from this browser?`}
                  trigger={<Button variant='secondary' size='icon' icon={Trash2Icon} className='shrink-0 md:w-auto md:px-4' aria-label='Delete collection'><span className='hidden md:inline'>Delete</span></Button>}
                >
                  <div className='mt-4 flex justify-end gap-2'>
                    <DialogClose render={<Button variant='secondary'>Cancel</Button>} />
                    <Button onClick={() => mutate(() => {
                      setCollections(current => current.filter(item => item.id !== localId))
                      void navigate({ to: '/' })
                    })}
                    >
                      Delete collection
                    </Button>
                  </div>
                </Dialog>
              </>
            )}
          </div>
        </>
      )}
      right={collection.trackIds.length === 0
        ? (
            <p className='text-base-600-400'>Use a track’s options menu to add tracks to this collection.</p>
          )
        : !selectedInstance
            ? (
                <Button variant='secondary' href='/_/preferences/instance'>Choose an instance to load tracks</Button>
              )
            : (
                <>
                  <QueryView
                    query={query}
                    content={(tracks) => {
                      const tracksById = new Map(tracks.map(track => [track.id, track]))
                      return collection.trackIds.map((id, index) => {
                        const track = tracksById.get(id)
                        const label = track?.title ?? `Track ${id}`
                        return (
                          <div key={id}>
                            {track ? <TrackListing track={track} /> : <GenericListing title={label} subtitle='Unavailable' thumbnail={{ alt: label }} disabled />}
                            {localId && (
                              <motion.div initial={false} animate={{ height: isEditing ? 'auto' : 0, opacity: isEditing ? 1 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} inert={!isEditing} aria-hidden={!isEditing} className='overflow-hidden'>
                                <div className='flex items-center gap-2 pt-2'>
                                  <span className='mr-auto text-sm text-base-600-400'>
                                    {index + 1}
                                    {' '}
                                    /
                                    {' '}
                                    {collection.trackIds.length}
                                  </span>
                                  <Button variant='secondary' size='icon' icon={ArrowUpIcon} aria-label={`Move ${label} up`} disabled={index === 0} onClick={() => mutate(() => update({ trackIds: moveCollectionTrack(collection.trackIds, id, -1) }))} />
                                  <Button variant='secondary' size='icon' icon={ArrowDownIcon} aria-label={`Move ${label} down`} disabled={index === collection.trackIds.length - 1} onClick={() => mutate(() => update({ trackIds: moveCollectionTrack(collection.trackIds, id, 1) }))} />
                                  <Button variant='secondary' size='icon' icon={XIcon} aria-label={`Remove ${label} from collection`} onClick={() => mutate(() => update({ trackIds: collection.trackIds.filter(trackId => trackId !== id) }))} />
                                </div>
                              </motion.div>
                            )}
                          </div>
                        )
                      })
                    }}
                  />
                  {query.isError && <Button variant='secondary' onClick={() => void query.refetch()}>Retry loading tracks</Button>}
                </>
              )}
    />
  )
}
