import { selectedInstanceAtom } from '$lib/atoms'
import { getDefaultStore } from 'jotai'

interface Init<T> extends RequestInit {
  schema?: (input: unknown) => T
  searchParams?: SearchParams
}

interface SearchParams {
  [key: string]: string | number | boolean | undefined | null
}

function formatSearchParams(o: SearchParams) {
  return (
    `?${
      Object.entries(o)
        .filter(([, v]) => v != null)
        .map(
          ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
        )
        .join('&')}`
  )
}

export async function $api<T>(
  input: string,
  { schema, searchParams, ...baseInit }: Init<T> = {},
) {
  const selectedInstance = getDefaultStore().get(selectedInstanceAtom)

  if (!selectedInstance) {
    location.assign('/_/preferences/instance')
    throw new Error('No server selected')
  }

  const url = [
    selectedInstance,
    '/_/api/v2',
    input,
    searchParams && formatSearchParams(searchParams),
  ]
    .filter(Boolean)
    .join('')

  const res = await (await fetch(url, baseInit)).json()

  if (schema && import.meta.env.DEV) {
    return schema(res)
  }

  return res as T
}

export function getPermalinkPath(...permalinks: string[]) {
  const permalinkUrl = `https://soundcloud.com/${permalinks.join('/')}`
  const url = `/resolve?url=${encodeURIComponent(permalinkUrl)}` as const
  return url
}
