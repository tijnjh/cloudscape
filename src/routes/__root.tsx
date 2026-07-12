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
import { shades } from '$lib/theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { ChevronLeft } from 'lucide-react'
import { useEffect } from 'react'
import './layout.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

function RootLayout() {
  const location = useLocation()
  const selectedBaseColor = useAtomValue(selectedBaseColorAtom)
  const selectedAccentColor = useAtomValue(selectedAccentColorAtom)
  const isBlackAccent = useAtomValue(isBlackAccentAtom)
  const themeMode = useAtomValue(themeModeAtom)

  useEffect(() => {
    document.querySelector<HTMLLinkElement>('link[rel=\'icon\']')?.remove()
    const link = document.createElement('link')
    link.rel = 'icon'
    link.href = favicon
    document.head.append(link)
  }, [])

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
    const media = matchMedia('(prefers-color-scheme: dark)')
    const update = () => {
      const isDark = themeMode === 'dark' || (themeMode === 'system' && media.matches)
      document.documentElement.classList.toggle('dark', isDark)
      document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
    }

    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [themeMode])

  return (
    <QueryClientProvider client={queryClient}>
      {location.pathname !== '/' && (
        <div
          className='fixed inset-x-0 top-0 z-20 mx-auto flex max-w-5xl justify-between bg-linear-to-b from-base-200-800 to-base-300-700/0 p-4'
        >
          <Button
            variant='secondary'
            icon={ChevronLeft}
            onClick={() => history.back()}
          >
            Back
          </Button>

          <Button variant='secondary' href='/'>Home</Button>
        </div>
      )}

      <NowPlayingView />
      <NowPlayingBar />

      <Outlet />
    </QueryClientProvider>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
