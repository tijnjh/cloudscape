import type { Track } from '$lib/schemas/track'
import type { Action } from '../menu'
import {
  favoriteTrackIdsAtom,
  isPausedAtom,
  nowPlayingAtom,
} from '$lib/atoms'
import { collectionsAtom } from '$lib/collection-atoms'
import { maxCollectionTracks } from '$lib/collections'
import { useLocation } from '@tanstack/react-router'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { CheckIcon, ClipboardIcon, DiscIcon, LibraryIcon, ListPlusIcon, PlusIcon, SpeakerIcon, StarIcon, StarOffIcon, UserIcon } from 'lucide-react'
import { GenericListing } from './generic-listing'

export function useTrackListingMenuActions(track: Track) {
  const location = useLocation()
  const favoriteTrackIds = useAtomValue(favoriteTrackIdsAtom)
  const setFavoriteTrackIds = useSetAtom(favoriteTrackIdsAtom)
  const isFavorited = favoriteTrackIds.includes(track.id)
  const [collections, setCollections] = useAtom(collectionsAtom)

  return [
    {
      label: isFavorited ? 'Unfavorite' : 'Favorite',
      icon: isFavorited ? StarOffIcon : StarIcon,
      onClick: () => {
        setFavoriteTrackIds((ids) => {
          if (ids.includes(track.id)) {
            return ids.filter(
              id => id !== track.id,
            )
          }

          return [...ids, track.id]
        })
      },
    },

    {
      label: 'Add to collection',
      icon: ListPlusIcon,
      children: [
        ...collections.map((collection) => {
          const added = collection.trackIds.includes(track.id)
          const full = collection.trackIds.length >= maxCollectionTracks
          return {
            id: collection.id,
            label: `${collection.name}${full && !added ? ' (full)' : ''}`,
            icon: added ? CheckIcon : LibraryIcon,
            disabled: added || full,
            onClick: () => {
              setCollections(current => current.map(item => item.id === collection.id && !item.trackIds.includes(track.id) && item.trackIds.length < maxCollectionTracks
                ? { ...item, trackIds: [...item.trackIds, track.id] }
                : item))
            },
          }
        }),
        {
          label: collections.length === 0 ? 'No collections yet — create one on Home' : 'Create a collection on Home',
          icon: PlusIcon,
          href: '/',
        },
      ],
    },

    ...(location.pathname !== `/${track.user.permalink}/${track.permalink}`
      ? [
          {
            label: 'Go to track',
            icon: DiscIcon,
            href: `/${track.user.permalink}/${track.permalink}`,
          },
        ]
      : []),

    ...(location.pathname !== `/${track.user.permalink}`
      ? [
          {
            label: 'Go to artist',
            icon: UserIcon,
            href: `/${track.user.permalink}`,
          },
        ]
      : []),

    ...(!location.pathname.includes(`track-stations:${track.id}`)
      ? [
          {
            label: `Go to track station`,
            href: `/discover/sets/track-stations:${track.id}`,
            icon: SpeakerIcon,
          },
        ]
      : []),

    {
      label: 'Copy track URL',
      icon: ClipboardIcon,
      onClick: () => {
        const url = `${window.location.protocol}//${window.location.host}/${track.user.permalink}/${track.permalink}`
        navigator.clipboard?.writeText(url)
      },
    },
  ] satisfies Action[]
}

export function TrackListing({ track }: { track: Track }) {
  const setNowPlaying = useSetAtom(nowPlayingAtom)
  const setIsPaused = useSetAtom(isPausedAtom)
  const isBlocked = track.policy === 'BLOCK'

  return (
    <GenericListing
      title={track.title}
      subtitle={track.user.username}
      thumbnail={{
        src: track.artwork_url,
        alt: `Album cover of ${track.title}`,
      }}
      disabled={isBlocked}
      onClick={() => {
        setNowPlaying(track)
        setIsPaused(isBlocked)
      }}
      badges={track.policy === 'SNIP' ? ['30s only'] : []}
      actions={useTrackListingMenuActions(track)}
    />
  )
}
