import type { Playlist } from '$lib/schemas/playlist'
import { Link } from '@tanstack/react-router'
import { GenericListing } from './GenericListing'

export function PlaylistListing({ playlist }: { playlist: Playlist }) {
  return (
    <GenericListing
      title={playlist.title}
      subtitle={playlist.user.username}
      thumbnail={{
        src: playlist.artwork_url,
        alt: `Playlist picture of ${playlist.title}`,
      }}
      render={(
        <Link
          to='/$user/sets/$playlist'
          params={{
            user: playlist.user.permalink,
            playlist: playlist.permalink,
          }}
        />
      )}
      badges={playlist.is_album ? ['Album'] : []}
    />
  )
}
