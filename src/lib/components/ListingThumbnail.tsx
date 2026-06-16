import type { ClassValue } from 'cnfn'
import { cn } from 'cnfn'
import { useState } from 'react'

export interface ListingThumbnailProps {
  src?: string | null
  alt: string
  className?: ClassValue
}

export default function ListingThumbnail({ src, alt, className }: ListingThumbnailProps) {
  const [hasFailed, setHasFailed] = useState(false)

  if (src && !hasFailed) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn('aspect-square size-12 rounded-sm', className)}
        onError={() => setHasFailed(true)}
      />
    )
  }

  return <div className="aspect-square size-12 rounded-sm bg-base-300-700" />
}
