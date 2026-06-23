import { goto } from '$app/navigation'
import { resolve } from '$app/paths'
import { selectedInstance } from '$lib/global.svelte'
import { Data, Effect, Schema } from 'effect'

interface Init<TSchema extends Schema.Schema<unknown>> extends RequestInit {
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

export class FetchError extends Data.TaggedError('FetchError')<{ message: string }> {}

export const $api = Effect.fn(function* <TSchema extends Schema.Schema<unknown>>(
  input: string,
  { schema, searchParams, ...baseInit }: Init<TSchema> = {},
) {
  if (!selectedInstance.current) {
    throw goto(resolve('/_/preferences/instance'))
  }

  const url = [
    selectedInstance.current,
    '/_/api/v2',
    input,
    searchParams && formatSearchParams(searchParams),
  ]
    .filter(Boolean)
    .join('')

  const res = yield* Effect.tryPromise({
    try: () => fetch(url, baseInit).then(r => r.json),
    catch: () => new FetchError({ message: 'failed to fetch' }),
  })

  if (schema && import.meta.env.dev) {
    return yield* Schema.decodeUnknownEffect(schema)(res, {
      onExcessProperty: 'error',
    })
  }

  return res as TSchema['Type']
})

export function getPermalinkPath(...permalinks: string[]) {
  const permalinkUrl = `https://soundcloud.com/${permalinks.join('/')}`
  const url = `/resolve?url=${encodeURIComponent(permalinkUrl)}` as const
  return url
}
