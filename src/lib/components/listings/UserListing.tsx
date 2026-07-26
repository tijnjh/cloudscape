import type { User } from '$lib/schemas/user'
import { Link } from '@tanstack/react-router'
import { GenericListing } from './GenericListing'

export function UserListing({ user }: { user: User }) {
  return (
    <GenericListing
      title={`${user.username}`}
      subtitle={user.permalink}
      thumbnail={{
        src: user.avatar_url,
        alt: `Profile picture of ${user.permalink}`,
        className: 'rounded-full',
      }}
      render={(
        <Link
          to='/$user'
          params={{
            user: user.permalink,
          }}
        />
      )}
      badges={[user.verified && 'Verified']}
    />
  )
}
