import favicon from '$lib/assets/favicon.svg'
import NowPlayingBar from '$lib/components/NowPlayingBar'
import NowPlayingView from '$lib/components/NowPlayingView'
import Button from '$lib/components/ui/Button'
import {
  isBlackAccentAtom,
  selectedAccentColorAtom,
  selectedBaseColorAtom,
  themeModeAtom,
} from '$lib/global'
import { useFavicon } from '$lib/hooks'
import { shades } from '$lib/theme'
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { ChevronLeft } from 'lucide-react'
import { useEffect } from 'react'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const pathname = useRouterState({ select: state => state.location.pathname })

  useFavicon(favicon)

  return (
    <>
      <ThemeController />

      {pathname !== '/' && (
        <div className="fixed inset-x-0 top-0 z-20 mx-auto flex max-w-5xl justify-between bg-linear-to-b from-base-200-800 to-base-300-700/0 p-4">
          <Button
            variant="secondary"
            icon={ChevronLeft}
            onClick={() => history.back()}
          >
            Back
          </Button>

          <Button variant="secondary" href="/">Home</Button>
        </div>
      )}

      <NowPlayingView />
      <NowPlayingBar />

      <Outlet />
    </>
  )
}

function ThemeController() {
  const selectedBaseColor = useAtomValue(selectedBaseColorAtom)
  const selectedAccentColor = useAtomValue(selectedAccentColorAtom)
  const isBlackAccent = useAtomValue(isBlackAccentAtom)
  const themeMode = useAtomValue(themeModeAtom)

  useEffect(() => {
    for (const shade of shades) {
      document.documentElement.style.setProperty(
        `--t-base-${shade}`,
        `var(--color-${selectedBaseColor}-${shade})`,
      )
      document.documentElement.style.setProperty(
        `--t-accent-${shade}`,
        `var(--color-${selectedAccentColor}-${shade})`,
      )
    }
  }, [selectedAccentColor, selectedBaseColor])

  useEffect(() => {
    document.documentElement.classList.toggle('black-accent', isBlackAccent)
  }, [isBlackAccent])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    function syncDarkClass() {
      document.documentElement.classList.toggle(
        'dark',
        themeMode === 'dark' || (themeMode === 'system' && mediaQuery.matches),
      )
    }

    syncDarkClass()
    mediaQuery.addEventListener('change', syncDarkClass)

    return () => {
      mediaQuery.removeEventListener('change', syncDarkClass)
    }
  }, [themeMode])

  return null
}
