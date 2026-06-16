import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'

export function useDebouncedValue<T>(value: T, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => window.clearTimeout(timeout)
  }, [delay, value])

  return debouncedValue
}

export function useIntersectionCallback<TElement extends Element>(
  callback: VoidFunction,
) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback((element: TElement | null) => {
    if (!element)
      return

    const observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        callbackRef.current()
      }
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])
}

export function useMediaQuery(query: string) {
  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined')
      return false

    return window.matchMedia(query).matches
  }, [query])

  const subscribe = useCallback((callback: VoidFunction) => {
    const mediaQuery = window.matchMedia(query)

    mediaQuery.addEventListener('change', callback)

    return () => {
      mediaQuery.removeEventListener('change', callback)
    }
  }, [query])

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    if (title) {
      document.title = title
    }
  }, [title])
}

export function useFavicon(href?: string | null) {
  useEffect(() => {
    if (!href)
      return

    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')

    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.append(link)
    }

    link.href = href
  }, [href])
}

export function useStableSearchValue<T extends string>(
  rawValue: unknown,
  fallback: T,
  allowedValues?: readonly T[],
) {
  return useMemo(() => {
    if (typeof rawValue !== 'string')
      return fallback

    if (allowedValues && !allowedValues.includes(rawValue as T))
      return fallback

    return rawValue as T
  }, [allowedValues, fallback, rawValue])
}
