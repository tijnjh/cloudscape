import type { LucideIcon } from 'lucide-react'
import { useMediaQuery } from '$lib/hooks'
import { cn } from 'cnfn'
import { EllipsisIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import Button from './ui/Button'

export interface Action {
  label: string
  icon: LucideIcon
  onClick?: VoidFunction
  href?: string
}

export default function Menu({
  title,
  subtitle,
  actions = [],
}: {
  title?: string
  subtitle?: string
  actions?: Action[]
}) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const trigger = (
    <Button
      variant="secondary"
      size="icon"
      className="shrink-0"
      aria-label="More options"
      onClick={() => setOpen(value => !value)}
    >
      <EllipsisIcon size={16} />
    </Button>
  )

  function handleActionClick(action: Action) {
    action.onClick?.()
    setOpen(false)
  }

  if (isDesktop) {
    return (
      <div className="relative">
        {trigger}

        <AnimatePresence>
          {open && (
            <motion.div
              className="absolute right-0 z-1000 flex origin-top-right flex-col gap-2 pt-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
            >
              {actions.map(action => (
                <Button
                  key={action.label}
                  href={action.href}
                  onClick={() => handleActionClick(action)}
                  icon={action.icon}
                  className="w-full justify-start"
                >
                  {action.label}
                </Button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <>
      {trigger}

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-base-950/50 backdrop-blur-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              className={cn(
                'fixed inset-x-0 bottom-0 z-50 mb-24 w-full',
              )}
              initial={{ y: '100%', opacity: 0, filter: 'blur(8px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: '100%', opacity: 0, filter: 'blur(8px)' }}
            >
              <div className="flex h-full flex-col justify-center gap-2 overflow-scroll p-4">
                <h1 className="w-fit text-3xl font-medium text-base-100">
                  {title}
                </h1>

                <p className="mb-4 w-fit text-lg text-base-100">
                  {subtitle}
                </p>

                {actions.map(action => (
                  <Button
                    key={action.label}
                    icon={action.icon}
                    onClick={() => handleActionClick(action)}
                    variant="secondary"
                    href={action.href}
                    className="w-full justify-start"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
