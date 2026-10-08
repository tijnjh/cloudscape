import { $api, api } from '$lib/api/client'
import { favoriteTrackIdsAtom } from '$lib/atoms'
import { PlaylistListing } from '$lib/components/listings/playlist-listing'
import { SystemPlaylistListing } from '$lib/components/listings/system-playlist-listing'
import { TrackListing } from '$lib/components/listings/track-listing'
import { UserListing } from '$lib/components/listings/user-listing'
import { Main } from '$lib/components/main'
import { QueryView } from '$lib/components/query-view'
import { SearchBar } from '$lib/components/search-bar'
import { Button } from '$lib/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { getDefaultStore, useAtomValue } from 'jotai'
import { Settings2Icon } from 'lucide-react'
import { match } from 'matchexpr'

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: async () => {
    // const selections = await getSelections()
    const { data: selections } = await api.GET('/_/api/v2/mixed-selections')

    const favoriteTrackIds = getDefaultStore().get(favoriteTrackIdsAtom)

    const { data: favorites } = await api.GET('/_/api/v2/tracks', {
      params: { query: { ids: favoriteTrackIds } },
    })

    return { selections, favorites }
  },

  head: () => ({
    meta: [{ title: 'Cloudscape' }],
  }),
})

function HomePage() {
  const { selections, favorites } = Route.useLoaderData()
  const favoriteTrackIds = useAtomValue(favoriteTrackIdsAtom)

  const favoritesQuery = $api.useQuery('get', '/_/api/v2/tracks', {
    params: { query: { ids: favoriteTrackIds } },
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

          {favoriteTrackIds.length > 0 && (
            <>
              <h2
                title='These are saved in localstorage'
                className='mt-8 text-2xl font-medium'
              >
                Your Favorites
              </h2>

              <QueryView
                query={favoritesQuery}
                content={favorites => favorites.map(favorite => (
                  <TrackListing key={favorite.id} track={favorite} />
                ))}
              />
            </>
          )}
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
