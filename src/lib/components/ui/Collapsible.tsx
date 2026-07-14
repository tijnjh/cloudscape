import type { ReactNode } from 'react'
import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible'

export function Collapsible({
  children,
  summary,
}: {
  children: ReactNode
  summary: string
}) {
  return (
    <CollapsiblePrimitive.Root className='relative overflow-hidden'>
      <CollapsiblePrimitive.Trigger
        className='mb-2 w-fit cursor-pointer rounded-md bg-base-300-700 px-4 py-1'
      >
        {summary}
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Panel className='mb-32 pt-2'>
        {children}
      </CollapsiblePrimitive.Panel>
    </CollapsiblePrimitive.Root>
  )
}
