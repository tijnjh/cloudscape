import type { Track } from './schemas/track'
import type { AccentColor, BaseColor } from './theme'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type ThemeMode = 'light' | 'dark' | 'system'

const defaultInstance
  = import.meta.env.PUBLIC_DEFAULT_INSTANCE
    || import.meta.env.VITE_DEFAULT_INSTANCE
    || undefined

export const nowPlayingAtom = atomWithStorage<Track | null>(
  'now-playing',
  null,
  undefined,
  { getOnInit: true },
)

export const favoriteTrackIdsAtom = atomWithStorage<number[]>(
  'favorites',
  [],
  undefined,
  { getOnInit: true },
)

export const showNowPlayingViewAtom = atom(false)
export const isPausedAtom = atom(true)

export const selectedInstanceAtom = atomWithStorage<string | undefined>(
  'selected-instance',
  defaultInstance,
  undefined,
  { getOnInit: true },
)

export const selectedBaseColorAtom = atomWithStorage<BaseColor>(
  'selected-base-color',
  'mist',
  undefined,
  { getOnInit: true },
)

export const selectedAccentColorAtom = atomWithStorage<AccentColor>(
  'selected-accent-color',
  'emerald',
  undefined,
  { getOnInit: true },
)

export const isBlackAccentAtom = atomWithStorage<boolean>(
  'is-black-accent',
  true,
  undefined,
  { getOnInit: true },
)

export const themeModeAtom = atomWithStorage<ThemeMode>(
  'mode-watcher-mode',
  'system',
  undefined,
  { getOnInit: true },
)
