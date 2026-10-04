import { cn } from 'cnfast'
import { useState } from 'react'

export function ListingThumbnail({
  src,
  alt,
  className,
}: {
  src?: string | null
  alt: string
  className?: string
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  if (src && src !== failedSrc) {
    return (
      <img
        src={src}
        alt={alt}
        width='48'
        height='48'
        className={cn('aspect-square size-12 rounded-sm', className)}
        onError={() => setFailedSrc(src)}
      />
    )
  }

  return <div className='aspect-square size-12 rounded-sm bg-base-300-700' />
}
