import type { ReactNode } from 'react'
import { Dialog } from '@base-ui/react/dialog'

export function DialogContent({ title, description, children }: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <Dialog.Portal>
      <Dialog.Backdrop className='fixed inset-0 z-40 bg-base-950/50 backdrop-blur-sm transition-opacity duration-200 data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none' />
      <Dialog.Popup className='fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-1/2 rounded-2xl bg-base-200-800 p-6 shadow-xl transition-[opacity,scale] duration-200 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none'>
        <Dialog.Title className='text-2xl font-medium'>{title}</Dialog.Title>
        <Dialog.Description className={description ? 'mt-2 wrap-anywhere' : 'sr-only'}>{description ?? title}</Dialog.Description>
        {children}
      </Dialog.Popup>
    </Dialog.Portal>
  )
}
