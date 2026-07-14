import { useEffect, useRef } from 'react'

export function useWhenInView(fn: VoidFunction) {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element)
      return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting)
        fn()
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [fn])

  return ref
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

export function formatDate(date?: Date | string | null | undefined) {
  if (!date)
    return
  const normalizedDate = typeof date === 'string' ? new Date(date) : date
  return dateFormatter.format(normalizedDate)
}
