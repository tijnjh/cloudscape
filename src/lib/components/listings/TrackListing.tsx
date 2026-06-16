import type { Track } from '$lib/schemas/track'
import { isPausedAtom, nowPlayingAtom } from '$lib/global'
import { useSetAtom } from 'jotai'
import GenericListing from './GenericListing'
import { useTrackListingMenuActions } from './useTrackListingMenuActions'

export default function TrackListing({ track }: { track: Track }) {
  const setNowPlaying = useSetAtom(nowPlayingAtom)
  const setIsPaused = useSetAtom(isPausedAtom)
  const actions = useTrackListingMenuActions(track)

  return (
    <GenericListing
      title={track.title}
      subtitle={track.user.username}
      thumbnail={{
        src: track.artwork_url,
        alt: `Album cover of ${track.title}`,
      }}
      onClick={() => {
        setIsPaused(false)
        setNowPlaying(track)
      }}
      badges={track.policy === 'SNIP' ? ['30s only'] : []}
      actions={actions}
    />
  )
}
