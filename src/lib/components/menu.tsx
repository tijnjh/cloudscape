import type { LucideIcon } from 'lucide-react'
import { useMediaQuery } from '$lib/hooks'
import { Dialog } from '@base-ui/react/dialog'
import { Menu as BaseMenu } from '@base-ui/react/menu'
import { ChevronLeftIcon, ChevronRightIcon, EllipsisIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'

export interface Action {
  id?: string
  label: string
  icon: LucideIcon
  href?: string
  onClick?: VoidFunction
  disabled?: boolean
  children?: Action[]
}

export function Menu({
  title,
  subtitle,
  actions,
}: {
  title?: string
  subtitle?: string
  actions?: Action[]
}) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [open, setOpen] = useState(false)
  const [path, setPath] = useState<string[]>([])
  const [error, setError] = useState('')
  const activeSubmenu = path.reduce<Action | undefined>(
    (parent, id) => (parent?.children ?? actions)?.find(action => (action.id ?? action.label) === id),
    undefined,
  )

  function onOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (nextOpen) {
      setPath([])
      setError('')
    }
  }

  function activate(action: Action) {
    try {
      action.onClick?.()
      setOpen(false)
    }
    catch {
      setError('Could not save. Check that browser storage is available and has free space.')
    }
  }

  const trigger = (
    <Button
      variant='secondary'
      size='icon'
      className='shrink-0'
      aria-label='More options'
    >
      <EllipsisIcon size={16} />
    </Button>
  )

  if (isDesktop) {
    return (
      <BaseMenu.Root open={open} onOpenChange={onOpenChange}>
        <BaseMenu.Trigger render={trigger} />
        <BaseMenu.Portal>
          <BaseMenu.Positioner align='end' sideOffset={8} className='z-1000'>
            <BaseMenu.Popup
              className='flex origin-(--transform-origin) flex-col gap-2 data-starting-style:scale-95 data-starting-style:opacity-0 transition-[scale,opacity] duration-150'
            >
              <DesktopMenuItems actions={actions} onAction={activate} error={error} />
              {error && <p role='alert' className='max-w-xs rounded-xl bg-base-300-700 p-3 text-sm'>{error}</p>}
            </BaseMenu.Popup>
          </BaseMenu.Positioner>
        </BaseMenu.Portal>
      </BaseMenu.Root>
    )
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger render={trigger} />

      <Dialog.Portal>
        <Dialog.Backdrop
          className='fixed inset-0 z-40 bg-base-950/50 backdrop-blur-lg transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:backdrop-blur-none motion-reduce:duration-150'
        />

        <Dialog.Popup
          className='fixed inset-x-0 bottom-0 z-50 mb-24 w-full transition-[translate,opacity,filter] duration-250 ease-drawer data-ending-style:translate-y-full data-ending-style:opacity-0 data-ending-style:blur-sm data-starting-style:translate-y-full data-starting-style:opacity-0 data-starting-style:blur-sm motion-reduce:duration-150 motion-reduce:data-ending-style:translate-y-0 motion-reduce:data-starting-style:translate-y-0'
        >
          <div
            className='flex max-h-[calc(100dvh-8rem)] flex-col gap-2 overflow-y-auto p-4'
          >
            <Dialog.Title className='w-fit text-3xl font-medium text-base-100'>
              {activeSubmenu?.label ?? title ?? 'Track options'}
            </Dialog.Title>

            <Dialog.Description className='mb-4 w-fit text-lg text-base-100'>
              {activeSubmenu ? 'Choose a collection' : subtitle}
            </Dialog.Description>

            {activeSubmenu && (
              <Button variant='secondary' icon={ChevronLeftIcon} className='w-full justify-start' onClick={() => setPath(current => current.slice(0, -1))}>
                Back to options
              </Button>
            )}
            {(activeSubmenu?.children ?? actions)?.map(action => (
              <Button
                key={action.id ?? action.label}
                icon={action.icon}
                variant='secondary'
                href={action.href}
                disabled={action.disabled}
                className='w-full justify-start'
                onClick={() => action.children
                  ? setPath(current => [...current, action.id ?? action.label])
                  : activate(action)}
              >
                <span className='truncate'>{action.label}</span>
                {action.children && <ChevronRightIcon size={16} className='ml-auto shrink-0' />}
              </Button>
            ))}
            {error && <p role='alert' className='rounded-xl bg-base-300-700 p-3 text-sm'>{error}</p>}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function DesktopMenuItems({ actions, onAction, error }: {
  actions?: Action[]
  onAction: (action: Action) => void
  error: string
}) {
  return actions?.map(action => action.children
    ? (
        <BaseMenu.SubmenuRoot key={action.id ?? action.label}>
          <BaseMenu.SubmenuTrigger
            nativeButton
            disabled={action.disabled}
            render={(
              <Button icon={action.icon} className='w-full justify-start'>
                {action.label}
                <ChevronRightIcon size={16} className='ml-auto shrink-0' />
              </Button>
            )}
          />
          <BaseMenu.Portal>
            <BaseMenu.Positioner sideOffset={8} className='z-1000'>
              <BaseMenu.Popup className='flex max-h-(--available-height) max-w-[calc(100vw-2rem)] min-w-56 flex-col gap-2 overflow-y-auto rounded-xl bg-base-300-700 p-2 shadow-xl'>
                <DesktopMenuItems actions={action.children} onAction={onAction} error={error} />
                {error && <p role='alert' className='max-w-xs p-3 text-sm'>{error}</p>}
              </BaseMenu.Popup>
            </BaseMenu.Positioner>
          </BaseMenu.Portal>
        </BaseMenu.SubmenuRoot>
      )
    : (
        <BaseMenu.Item
          key={action.id ?? action.label}
          nativeButton={!action.href}
          disabled={action.disabled}
          closeOnClick={false}
          onClick={() => onAction(action)}
          render={(
            <Button
              href={action.href}
              icon={action.icon}
              disabled={action.disabled}
              className='w-full justify-start'
            >
              <span className='truncate'>{action.label}</span>
            </Button>
          )}
        />
      ))
}
