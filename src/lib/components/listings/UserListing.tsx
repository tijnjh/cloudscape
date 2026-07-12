import type { User } from '$lib/schemas/user'
import GenericListing from './GenericListing'

export default function UserListing({ user }: { user: User }) {
  return (
    <GenericListing
      title={`${user.username}`}
      subtitle={user.permalink}
      thumbnail={{
        src: user.avatar_url,
        alt: `Profile picture of ${user.permalink}`,
        className: 'rounded-full',
      }}
      href={`/${user.permalink}`}
      badges={[user.verified && 'Verified']}
    />
  )
}
