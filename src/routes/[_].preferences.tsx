import Main from '$lib/components/Main'
import Button from '$lib/components/ui/Button'
import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { ServerCogIcon, SwatchBookIcon } from 'lucide-react'

const tabs = [
  { name: 'theme', icon: SwatchBookIcon },
  { name: 'instance', icon: ServerCogIcon },
]

export const Route = createFileRoute('/_/preferences')({
  component: PreferencesLayout,
})

function PreferencesLayout() {
  const location = useLocation()

  return (
    <Main
      split={[25, 75]}
      left={(
        <div className='flex gap-2 lg:contents'>
          {tabs.map((tab) => {
            const href = `/_/preferences/${tab.name}`
            const isSelected = location.pathname === href

            return (
              <Button
                key={tab.name}
                href={href}
                icon={tab.icon}
                className='w-fit justify-start capitalize md:w-full'
                variant={isSelected ? 'primary' : 'secondary'}
              >
                {tab.name}
              </Button>
            )
          })}
        </div>
      )}
      right={<Outlet />}
    />
  )
}
