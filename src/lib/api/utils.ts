import { selectedInstanceAtom } from '$lib/global'
import { getDefaultStore } from 'jotai'
import * as v from 'valibot'

interface Init<TSchema extends v.GenericSchema> extends RequestInit {
  schema?: TSchema
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

export async function $api<TSchema extends v.GenericSchema>(
  input: string,
  { schema, searchParams, ...baseInit }: Init<TSchema> = {},
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

  if (schema && import.meta.env.dev) {
    return v.parse(schema, res)
  }

  return res as v.InferOutput<TSchema>
}

export function getPermalinkPath(...permalinks: string[]) {
  const permalinkUrl = `https://soundcloud.com/${permalinks.join('/')}`
  const url = `/resolve?url=${encodeURIComponent(permalinkUrl)}` as const
  return url
}
