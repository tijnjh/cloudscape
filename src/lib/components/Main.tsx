import type { ReactNode } from 'react'
import { cn } from 'cnfn'

export default function Main({
  children,
  left,
  right,
  split: [leftSplit, rightSplit] = [50, 50],
  className,
}: {
  children?: ReactNode
  left?: ReactNode
  right?: ReactNode
  split?: [number, number]
  className?: string
}) {
  function accountForGap(percent: number) {
    return `calc(${percent}% - .5rem)`
  }

  const gridTemplateColumns = `${accountForGap(leftSplit)} ${accountForGap(rightSplit)}`

  return (
    <main
      className={cn(
        'mx-auto mt-16 flex max-w-5xl flex-col md:grid md:gap-4',
        className,
      )}
      style={{ gridTemplateColumns }}
    >
      {left && (
        <div className='top-16 flex h-fit flex-col gap-4 p-4 md:sticky'>
          {left}
        </div>
      )}

      {right && (
        <div className='mb-64 flex flex-col gap-4 p-4'>
          {right}
        </div>
      )}

      {!left && !right && children && (
        <div className='mb-64 flex flex-col gap-4 p-4'>
          {children}
        </div>
      )}
    </main>
  )
}
