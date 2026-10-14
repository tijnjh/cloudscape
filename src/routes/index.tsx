import { getSelections } from '$lib/api/discovery'
import { getTracksByIds } from '$lib/api/track'
import { collectionsAtom, favoriteTrackIdsAtom } from '$lib/atoms'
import { createCollection } from '$lib/collections'
import { CollectionNameDialog } from '$lib/components/collection-name-dialog'
import { GenericListing } from '$lib/components/listings/generic-listing'
import { PlaylistListing } from '$lib/components/listings/playlist-listing'
import { SystemPlaylistListing } from '$lib/components/listings/system-playlist-listing'
import { TrackListing } from '$lib/components/listings/track-listing'
import { UserListing } from '$lib/components/listings/user-listing'
import { Main } from '$lib/components/main'
import { QueryView } from '$lib/components/query-view'
import { SearchBar } from '$lib/components/search-bar'
import { Button } from '$lib/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAtom, useAtomValue } from 'jotai'
import { Settings2Icon } from 'lucide-react'
import { match } from 'matchexpr'

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: async () => {
    const selections = await getSelections()
    return { selections }
  },

  head: () => ({
    meta: [{ title: 'Cloudscape' }],
  }),
})

function HomePage() {
  const { selections } = Route.useLoaderData()
  const [collections, setCollections] = useAtom(collectionsAtom)
  const navigate = useNavigate()
  const favoriteTrackIds = useAtomValue(favoriteTrackIdsAtom)
  const favoritesQuery = useQuery({
    queryKey: ['favorites', favoriteTrackIds],
    queryFn: () => getTracksByIds(favoriteTrackIds),
    enabled: favoriteTrackIds.length > 0,
  })

  return (
    <Main
      className='mt-16'
      left={(
        <>
          <div className='flex w-full flex-col items-start gap-4'>
            <div className='flex w-full items-center justify-between'>
              <h1 className='text-3xl font-medium'>Cloudscape</h1>
              <div className='flex items-center gap-2'>
                <Button variant='secondary' href='https://tijn.dev/cloudscape'>
                  Source
                </Button>
                <Button size='icon' icon={Settings2Icon} href='/_/preferences' />
              </div>
            </div>

            <SearchBar />
          </div>

          <div className='mt-8 flex flex-wrap items-center justify-between gap-3'>
            <h2
              title='These are saved in localstorage'
              className='text-2xl font-medium'
            >
              Your Favorites
            </h2>
            <CollectionNameDialog onSave={(name) => {
              const collection = createCollection(name)
              setCollections(current => [...current, collection])
              void navigate({ to: '/_/collections', search: { id: collection.id } })
            }}
            >
              <Button variant='secondary'>Create collection</Button>
            </CollectionNameDialog>
          </div>

          {favoriteTrackIds.length > 0 && (
            <QueryView
              query={favoritesQuery}
              content={favorites => favorites.map(favorite => (
                <TrackListing key={favorite.id} track={favorite} />
              ))}
            />
          )}
          {collections.length > 0 && <h2 className='mt-4 text-2xl font-medium'>Your Collections</h2>}
          {collections.map(collection => (
            <GenericListing
              key={collection.id}
              title={collection.name}
              subtitle={`${collection.trackIds.length} ${collection.trackIds.length === 1 ? 'track' : 'tracks'}`}
              thumbnail={{ alt: collection.name }}
              href={`/_/collections?id=${collection.id}`}
            />
          ))}
        </>
      )}
      right={(
        selections.collection.length === 0
          ? <span className='mt-4 text-lg text-base-900-100/25'>Nothing here...</span>
          : selections.collection.map(selection => (
              <div key={selection.id} className='contents'>
                <h3 className='text-2xl font-medium'>
                  {selection.title}
                </h3>
                {selection.items.collection.map(item => match(item, 'kind', {
                  playlist: item => <PlaylistListing key={`${item.kind}${item.id}${selection.id}`} playlist={item} />,
                  'system-playlist': item => <SystemPlaylistListing key={`${item.kind}${item.id}${selection.id}`} playlist={item} />,
                  user: item => <UserListing key={`${item.kind}${item.id}${selection.id}`} user={item} />,
                }))}
                <br />
              </div>
            ))
      )}
    />
  )
}
