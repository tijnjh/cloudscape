import { useEffect, useState } from 'react'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => matchMedia(query).matches)

  useEffect(() => {
    const media = matchMedia(query)
    const update = () => setMatches(media.matches)

    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])

  return matches
}

export function useDocumentHead(title?: string, favicon?: string | null) {
  useEffect(() => {
    if (!title)
      return

    const previousTitle = document.title
    document.title = title
    return () => {
      document.title = previousTitle
    }
  }, [title])

  useEffect(() => {
    if (!favicon)
      return

    const link = document.createElement('link')
    link.rel = 'icon'
    link.href = favicon
    document.head.append(link)
    return () => link.remove()
  }, [favicon])
}
