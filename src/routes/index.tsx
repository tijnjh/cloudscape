import { getSelections } from '$lib/api/discovery'
import { getTracksByIds } from '$lib/api/track'
import PlaylistListing from '$lib/components/listings/PlaylistListing'
import TrackListing from '$lib/components/listings/TrackListing'
import UserListing from '$lib/components/listings/UserListing'
import Main from '$lib/components/Main'
import SearchBar from '$lib/components/SearchBar'
import Button from '$lib/components/ui/Button'
import { favoriteTrackIdsAtom } from '$lib/global'
import { createFileRoute } from '@tanstack/react-router'
import { getDefaultStore } from 'jotai'
import { Settings2Icon } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: async () => {
    const selections = await getSelections()

    const favoriteTrackIds = getDefaultStore().get(favoriteTrackIdsAtom)
    const favorites = await getTracksByIds(favoriteTrackIds)

    return { selections, favorites }
  },

  head: () => ({
    meta: [{ title: 'Cloudscape' }],
  }),
})

function HomePage() {
  const { favorites, selections } = Route.useLoaderData()

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

          <h2
            title='These are saved in localstorage'
            className='mt-8 text-2xl font-medium'
          >
            Your Favorites
          </h2>

          {favorites.map(favorite => (
            <TrackListing key={favorite.id} track={favorite} />
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
                {selection.items.collection.map(item => item.kind === 'playlist'
                  ? <PlaylistListing key={`${item.kind}${item.id}${selection.id}`} playlist={item} />
                  : <UserListing key={`${item.kind}${item.id}${selection.id}`} user={item} />)}
                <br />
              </div>
            ))
      )}
    />
  )
}
