import type { LocalCollection } from './collections'
import { atom } from 'jotai'
import * as v from 'valibot'
import { localCollectionSchema } from './collections.ts'

const key = 'collections'

function readCollections(): LocalCollection[] {
  try {
    const result = v.safeParse(v.array(localCollectionSchema), JSON.parse(localStorage.getItem(key) ?? '[]'))
    return result.success ? result.output : []
  }
  catch {
    return []
  }
}

const storedCollectionsAtom = atom(readCollections())
storedCollectionsAtom.onMount = (set) => {
  set(readCollections())
  const onStorage = (event: StorageEvent) => {
    if (event.storageArea === localStorage && (event.key === key || event.key === null))
      set(readCollections())
  }
  window.addEventListener('storage', onStorage)
  return () => window.removeEventListener('storage', onStorage)
}

export const collectionsAtom = atom(
  get => get(storedCollectionsAtom),
  (get, set, update: LocalCollection[] | ((current: LocalCollection[]) => LocalCollection[])) => {
    const current = get(storedCollectionsAtom)
    const next = typeof update === 'function' ? update(current) : update
    // A failed storage write must not leave an apparently saved collection in memory.
    localStorage.setItem(key, JSON.stringify(next))
    set(storedCollectionsAtom, next)
  },
)
