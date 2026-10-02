import type { SystemPlaylist } from '$lib/schemas/system-playlist'
import { GenericListing } from './GenericListing'

export function SystemPlaylistListing({ playlist }: { playlist: SystemPlaylist }) {
  return (
    <GenericListing
      title={playlist.title}
      subtitle={playlist.user.username}
      thumbnail={{
        src: playlist.calculated_artwork_url ?? playlist.artwork_url,
        alt: `Playlist picture of ${playlist.title}`,
      }}
      href={`/discover/sets/${playlist.permalink}`}
    />
  )
}
