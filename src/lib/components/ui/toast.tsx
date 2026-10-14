import type { ReactNode } from 'react'
import { Toast } from '@base-ui/react/toast'
import { XIcon } from 'lucide-react'
import { Button } from './button'

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <Toast.Provider timeout={3000} limit={3}>
      {children}
      <ToastViewport />
    </Toast.Provider>
  )
}

function ToastViewport() {
  const { toasts } = Toast.useToastManager()

  return (
    <Toast.Portal>
      <Toast.Viewport className='fixed right-4 bottom-24 z-1100 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 outline-none'>
        {toasts.map(toast => (
          <Toast.Root
            key={toast.id}
            toast={toast}
            className='flex items-center gap-3 rounded-xl bg-base-300-700 p-4 shadow-xl transition-[opacity,translate] duration-200 data-starting-style:translate-y-2 data-starting-style:opacity-0 data-ending-style:translate-y-2 data-ending-style:opacity-0 data-limited:hidden motion-reduce:transition-none'
          >
            <Toast.Content className='min-w-0 flex-1'>
              <Toast.Title className='font-medium' />
              <Toast.Description className='text-sm text-base-600-400' />
            </Toast.Content>
            <Toast.Close aria-label='Dismiss notification' render={<Button variant='secondary' size='icon' icon={XIcon} className='size-6 shrink-0' />} />
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  )
}
