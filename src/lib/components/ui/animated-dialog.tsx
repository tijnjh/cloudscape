import type { ReactNode } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

export function AnimatedDialog({ open, onOpenChange, children }: {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}) {
  const reduceMotion = useReducedMotion()
  const transition = { duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' } as const

  return (
    <AnimatePresence>
      {open && (
        // Keep the dialog mounted and modal until Motion finishes both exit animations.
        <Dialog.Root key='dialog' open onOpenChange={onOpenChange}>
          <Dialog.Portal>
            <Dialog.Backdrop
              className='fixed inset-0 z-40 bg-base-950/50 backdrop-blur-sm'
              render={(
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={transition}
                />
              )}
            />
            <Dialog.Popup
              className='fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-1/2 rounded-2xl bg-base-200-800 p-6 shadow-xl'
              render={(
                <motion.div
                  initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96, y: reduceMotion ? 0 : 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96, y: reduceMotion ? 0 : 12 }}
                  transition={transition}
                />
              )}
            >
              {children}
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  )
}
