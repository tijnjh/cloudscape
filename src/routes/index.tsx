import { getSelections } from '$lib/api/discovery'
import { getTracksByIds } from '$lib/api/track'
import { favoriteTrackIdsAtom, selectedInstanceAtom } from '$lib/atoms'
import { collectionsAtom } from '$lib/collection-atoms'
import { CreateCollectionButton } from '$lib/components/create-collection-button'
import { PlaylistListing } from '$lib/components/listings/playlist-listing'
import { SystemPlaylistListing } from '$lib/components/listings/system-playlist-listing'
import { TrackListing } from '$lib/components/listings/track-listing'
import { UserListing } from '$lib/components/listings/user-listing'
import { Main } from '$lib/components/main'
import { QueryView } from '$lib/components/query-view'
import { SearchBar } from '$lib/components/search-bar'
import { Button } from '$lib/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { LibraryIcon, Settings2Icon } from 'lucide-react'
import { match } from 'matchexpr'

export const Route = createFileRoute('/')({
  component: HomePage,

  head: () => ({
    meta: [{ title: 'Cloudscape' }],
  }),
})

function HomePage() {
  const selectedInstance = useAtomValue(selectedInstanceAtom)
  const collections = useAtomValue(collectionsAtom)
  const selectionsQuery = useQuery({
    queryKey: ['selections', selectedInstance],
    queryFn: getSelections,
    enabled: Boolean(selectedInstance),
  })
  const favoriteTrackIds = useAtomValue(favoriteTrackIdsAtom)
  const favoritesQuery = useQuery({
    queryKey: ['favorites', selectedInstance, favoriteTrackIds],
    queryFn: () => getTracksByIds(favoriteTrackIds),
    enabled: Boolean(selectedInstance) && favoriteTrackIds.length > 0,
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
            <h2 title='These are saved in localstorage' className='text-2xl font-medium'>Your Favorites</h2>
            <CreateCollectionButton />
          </div>

          {favoriteTrackIds.length > 0 && selectedInstance
            ? (
                <>
                  <QueryView
                    query={favoritesQuery}
                    content={favorites => favorites.map(favorite => (
                      <TrackListing key={favorite.id} track={favorite} />
                    ))}
                  />
                </>
              )
            : <p className='text-base-600-400'>{favoriteTrackIds.length ? 'Choose an instance to load your favorites.' : 'Your favorite tracks will appear here.'}</p>}

          {collections.length > 0 && (
            <>
              <h2 className='mt-4 text-2xl font-medium'>Your Collections</h2>
              {collections.map(collection => (
                <Link key={collection.id} to='/_/collections/$collectionId' params={{ collectionId: collection.id }} className='flex min-w-0 items-center gap-4 rounded-xl bg-base-300-700 p-4 hover:opacity-80'>
                  <LibraryIcon className='shrink-0' />
                  <div className='min-w-0'>
                    <h3 className='truncate font-medium'>{collection.name}</h3>
                    <p className='text-sm text-base-600-400'>
                      {collection.trackIds.length}
                      {' '}
                      {collection.trackIds.length === 1 ? 'track' : 'tracks'}
                    </p>
                  </div>
                </Link>
              ))}
            </>
          )}
        </>
      )}
      right={(
        !selectedInstance
          ? <Button variant='secondary' href='/_/preferences/instance'>Choose an instance to discover tracks</Button>
          : (
              <QueryView
                query={selectionsQuery}
                content={selections => selections.collection.length === 0
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
                    ))}
              />
            )
      )}
    />
  )
}
