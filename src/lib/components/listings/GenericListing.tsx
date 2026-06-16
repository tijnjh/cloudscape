import type { ButtonHTMLAttributes } from 'react'
import type { ListingThumbnailProps } from '../ListingThumbnail'
import type { Action } from '../Menu'
import { AppLink } from '$lib/router-link'
import ListingThumbnail from '../ListingThumbnail'
import Menu from '../Menu'
import Badge from '../ui/Badge'

export type GenericListingProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className' | 'title'
> & {
  title: string
  badges?: (string | false | undefined)[]
  subtitle: string
  thumbnail: ListingThumbnailProps
  actions?: Action[]
  href?: string
}

const listingClassName = [
  'relative isolate flex w-full min-w-0 cursor-pointer gap-4 text-left transition-transform active:scale-95 active:opacity-50',
  'before:absolute before:-inset-2 before:-z-10 before:rounded-[10px] before:bg-base-300-700 before:content-[\'\']',
  'before:scale-90 before:opacity-0 before:transition-[opacity,scale] hover:before:scale-100 hover:before:opacity-100',
].join(' ')

export default function GenericListing({
  title,
  badges = [],
  subtitle,
  thumbnail,
  actions,
  href,
  ...props
}: GenericListingProps) {
  const content = (
    <>
      <ListingThumbnail {...thumbnail} />

      <div className="flex flex-col truncate">
        <div className="flex gap-2">
          <h3 className="truncate">{title}</h3>

          {badges.map(badge => (
            badge ? <Badge key={badge} label={badge} /> : null
          ))}
        </div>
        <p className="truncate text-accent/75">
          {subtitle}
        </p>
      </div>
    </>
  )

  return (
    <div className="flex items-center gap-4 text-left">
      {href
        ? (
            <AppLink href={href} className={listingClassName}>
              {content}
            </AppLink>
          )
        : (
            <button type="button" {...props} className={listingClassName}>
              {content}
            </button>
          )}

      {actions && <Menu actions={actions} title={title} subtitle={subtitle} />}
    </div>
  )
}
