import type { User } from '$lib/schemas/user'
import { cn } from 'cnfn'
import { UserListing } from './listings/UserListing'
import { Badge } from './ui/Badge'
import { Collapsible } from './ui/Collapsible'

export interface HeroSectionProps {
  pictureSrc?: string | null
  title: string
  badges?: (string | false)[]
  description?: string | null
  user?: User
  roundedPicture?: boolean
}

export function HeroSection({
  pictureSrc,
  title,
  description,
  badges,
  user,
  roundedPicture = false,
}: HeroSectionProps) {
  return (
    <>
      {pictureSrc && (
        <img
          src={pictureSrc.replace('large', 't500x500')}
          width='500'
          height='500'
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = pictureSrc
          }}
          className={cn(
            'mx-auto my-4 aspect-square w-full max-w-xs',
            roundedPicture ? 'rounded-full' : 'rounded-xl',
          )}
          alt={title}
        />
      )}

      <div className='flex items-center gap-2'>
        <h1 className='text-2xl font-medium'>{title}</h1>
        {badges && (
          <div className='flex gap-2'>
            {badges.map(badge => badge && <Badge key={badge} label={badge} />)}
          </div>
        )}
      </div>

      {user && (
        <div className='flex flex-col gap-4'>
          <UserListing user={user} />
        </div>
      )}

      {description && (
        <Collapsible summary='Description'>
          <p className='whitespace-pre-wrap text-base-600-400'>
            {description}
          </p>
        </Collapsible>
      )}
    </>
  )
}
