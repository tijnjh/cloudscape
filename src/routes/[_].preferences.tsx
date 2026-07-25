import { Main } from '$lib/components/Main'
import { Button } from '$lib/components/ui/button'
import { IconColorSwatch, IconServerCog } from '@tabler/icons-react'
import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router'

const tabs = [
  { name: 'theme', icon: IconColorSwatch },
  { name: 'instance', icon: IconServerCog },
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
        <div className='flex gap-2 md:contents'>
          {tabs.map((tab) => {
            const href = `/_/preferences/${tab.name}`
            const isSelected = location.pathname === href

            return (
              <Button
                key={tab.name}
                render={<Link to={href} />}
                className='w-fit justify-start capitalize md:w-full'
                variant={isSelected ? 'default' : 'secondary'}
              >
                <tab.icon />
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
