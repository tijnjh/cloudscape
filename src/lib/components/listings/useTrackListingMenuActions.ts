import type { Track } from '$lib/schemas/track'
import type { Action } from '../Menu'
import { favoriteTrackIdsAtom } from '$lib/global'
import { useRouterState } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import {
  ClipboardIcon,
  DiscIcon,
  SpeakerIcon,
  StarIcon,
  StarOffIcon,
  UserIcon,
} from 'lucide-react'

export function useTrackListingMenuActions(track?: Track | null): Action[] {
  const [favoriteTrackIds, setFavoriteTrackIds] = useAtom(favoriteTrackIdsAtom)
  const pathname = useRouterState({ select: state => state.location.pathname })

  if (!track) {
    return []
  }

  const isFavorited = favoriteTrackIds.includes(track.id)

  return [
    {
      label: isFavorited ? 'Unfavorite' : 'Favorite',
      icon: isFavorited ? StarOffIcon : StarIcon,
      onClick: () => {
        if (favoriteTrackIds.includes(track.id)) {
          setFavoriteTrackIds(favoriteTrackIds.filter(id => id !== track.id))
        }
        else {
          setFavoriteTrackIds([...favoriteTrackIds, track.id])
        }
      },
    },

    ...(pathname !== `/${track.user.permalink}/${track.permalink}`
      ? [
          {
            label: 'Go to track',
            icon: DiscIcon,
            href: `/${track.user.permalink}/${track.permalink}`,
          },
        ]
      : []),

    ...(pathname !== `/${track.user.permalink}`
      ? [
          {
            label: 'Go to artist',
            icon: UserIcon,
            href: `/${track.user.permalink}`,
          },
        ]
      : []),

    ...(!pathname.includes(`track-stations:${track.id}`)
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
  ]
}
