import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { Dialog as BaseDialog } from '@base-ui/react/dialog'

export const DialogClose = BaseDialog.Close

export function Dialog({ title, description, trigger, children, ...props }: Omit<ComponentProps<typeof BaseDialog.Root>, 'children'> & {
  title: string
  trigger: ReactElement
  description?: string
  children: ReactNode
}) {
  return (
    <BaseDialog.Root {...props}>
      <BaseDialog.Trigger render={trigger} />
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className='fixed inset-0 z-40 bg-base-950/50 backdrop-blur-sm transition-opacity duration-200 data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none' />
        <BaseDialog.Popup className='fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-1/2 rounded-2xl bg-base-200-800 p-6 shadow-xl transition-[opacity,scale] duration-200 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none'>
          <BaseDialog.Title className='text-2xl font-medium'>{title}</BaseDialog.Title>
          <BaseDialog.Description className={description ? 'mt-2 wrap-anywhere' : 'sr-only'}>{description ?? title}</BaseDialog.Description>
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}
