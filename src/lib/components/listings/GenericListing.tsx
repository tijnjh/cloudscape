import type { ComponentProps } from 'react'
import type { ListingThumbnailProps } from '../ListingThumbnail'
import type { Action } from '../Menu'
import { Button as BaseButton } from '@base-ui/react/button'
import { Link } from '@tanstack/react-router'
import { ListingThumbnail } from '../ListingThumbnail'
import { Menu } from '../Menu'
import { Badge } from '../ui/Badge'

export type GenericListingProps = Omit<ComponentProps<typeof BaseButton>, 'className'> & {
  title: string
  badges?: (string | false)[]
  subtitle: string
  thumbnail: ListingThumbnailProps
  actions?: Action[]
  href?: string
}

export function GenericListing({
  title,
  badges,
  subtitle,
  thumbnail,
  actions,
  disabled,
  href,
  ...props
}: GenericListingProps) {
  const render = href ? <Link to={href} /> : undefined

  return (
    <div className='flex items-center gap-4 text-left'>
      <BaseButton
        render={render}
        nativeButton={!render}
        {...props}
        disabled={disabled}
        className={[
          'relative isolate flex w-full min-w-0 gap-4 text-left transition-transform duration-150 ease-out',
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer active:scale-97 active:opacity-50',
          'before:absolute before:-inset-2 before:-z-10 before:rounded-[10px] before:bg-base-300-700 before:content-[\'\']',
          'before:scale-95 before:opacity-0 before:transition-[opacity,scale] before:duration-160 before:ease-out [@media(hover:hover)_and_(pointer:fine)]:hover:before:scale-100 [@media(hover:hover)_and_(pointer:fine)]:hover:before:opacity-100',
          disabled && 'before:hidden',
        ].filter(Boolean).join(' ')}
      >
        <ListingThumbnail {...thumbnail} />

        <div className='flex flex-col truncate'>
          <div className='flex gap-2'>
            <h3 className='truncate'>{title}</h3>

            {badges?.map(badge => badge && <Badge key={badge} label={badge} />)}
          </div>
          <p className='truncate text-accent/75'>
            {subtitle}
          </p>
        </div>
      </BaseButton>

      {actions && (
        <Menu
          actions={actions}
          title={title}
          subtitle={subtitle}
        />
      )}
    </div>
  )
}
