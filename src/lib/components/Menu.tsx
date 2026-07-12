import type { LucideIcon } from 'lucide-react'
import { useMediaQuery } from '$lib/hooks'
import { Dialog } from '@base-ui/react/dialog'
import { Menu as BaseMenu } from '@base-ui/react/menu'
import { EllipsisIcon } from 'lucide-react'
import Button from './ui/Button'

export interface Action {
  label: string
  icon: LucideIcon
  href?: string
  onClick?: VoidFunction
}

export default function Menu({
  title,
  subtitle,
  actions,
}: {
  title?: string
  subtitle?: string
  actions?: Action[]
}) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

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
      <BaseMenu.Root>
        <BaseMenu.Trigger render={trigger} />
        <BaseMenu.Portal>
          <BaseMenu.Positioner align='end' sideOffset={8} className='z-1000'>
            <BaseMenu.Popup
              className='flex origin-(--transform-origin) flex-col gap-2 data-starting-style:scale-95 data-starting-style:opacity-0 transition-[scale,opacity] duration-150'
            >
              {actions?.map(action => (
                <BaseMenu.Item
                  key={action.label}
                  nativeButton={false}
                  onClick={action.onClick}
                  render={(
                    <Button
                      href={action.href}
                      icon={action.icon}
                      className='w-full justify-start'
                    >
                      {action.label}
                    </Button>
                  )}
                />
              ))}
            </BaseMenu.Popup>
          </BaseMenu.Positioner>
        </BaseMenu.Portal>
      </BaseMenu.Root>
    )
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger render={trigger} />

      <Dialog.Portal>
        <Dialog.Backdrop
          className='fixed inset-0 z-40 bg-base-950/50 backdrop-blur-lg transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:backdrop-blur-none motion-reduce:duration-150'
        />

        <Dialog.Popup
          className='fixed inset-x-0 bottom-0 z-50 mb-24 w-full transition-[translate,opacity,filter] duration-250 ease-drawer data-ending-style:translate-y-full data-ending-style:opacity-0 data-ending-style:blur-sm data-starting-style:translate-y-full data-starting-style:opacity-0 data-starting-style:blur-sm motion-reduce:duration-150 motion-reduce:data-ending-style:translate-y-0 motion-reduce:data-starting-style:translate-y-0'
        >
          <div
            className='flex h-full flex-col justify-center gap-2 overflow-scroll p-4'
          >
            <Dialog.Title className='w-fit text-3xl font-medium text-base-100'>
              {title}
            </Dialog.Title>

            <Dialog.Description className='mb-4 w-fit text-lg text-base-100'>
              {subtitle}
            </Dialog.Description>

            {actions?.map(action => (
              <Dialog.Close
                key={action.label}
                nativeButton={!action.href}
                onClick={action.onClick}
                render={(
                  <Button
                    icon={action.icon}
                    variant='secondary'
                    href={action.href}
                    className='w-full justify-start'
                  >
                    {action.label}
                  </Button>
                )}
              />
            ))}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
