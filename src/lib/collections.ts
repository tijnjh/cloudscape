import { deflateSync, inflateSync, strFromU8, strToU8 } from 'fflate'
import * as v from 'valibot'

export const maxCollectionNameLength = 200
export const maxCollectionTracks = 1000
const maxPayloadBytes = 64 * 1024
const maxEncodedLength = 32 * 1024

const collectionName = v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(maxCollectionNameLength))
const trackIds = v.pipe(
  v.array(v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(Number.MAX_SAFE_INTEGER))),
  v.maxLength(maxCollectionTracks),
  v.check(ids => new Set(ids).size === ids.length),
)

export const localCollectionSchema = v.object({
  id: v.string(),
  name: collectionName,
  trackIds,
})

export type LocalCollection = v.InferOutput<typeof localCollectionSchema>
export type CollectionContent = Pick<LocalCollection, 'name' | 'trackIds'>

const sharedCollectionSchema = v.tuple([collectionName, trackIds])

export function createCollection(name: string, ids: number[] = []): LocalCollection {
  return v.parse(localCollectionSchema, { id: crypto.randomUUID(), name, trackIds: ids })
}

export function moveCollectionTrack(ids: number[], id: number, direction: -1 | 1) {
  const index = ids.indexOf(id)
  const target = index + direction
  if (index < 0 || target < 0 || target >= ids.length)
    return ids

  const next = [...ids]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

// Match Webground's codec: UTF-8 → raw DEFLATE → unpadded Base64,
// substituting ~ for + and _ for /. A tuple avoids JSON property names.
export function encodeCollection(collection: CollectionContent) {
  const payload = v.parse(sharedCollectionSchema, [collection.name, collection.trackIds])
  const compressed = deflateSync(strToU8(JSON.stringify(payload)))
  return btoa(Array.from(compressed, byte => String.fromCharCode(byte)).join(''))
    .replaceAll('=', '')
    .replaceAll('+', '~')
    .replaceAll('/', '_')
}

export function decodeCollection(encoded: string): CollectionContent {
  try {
    if (!encoded || encoded.length > maxEncodedLength || !/^[\w~]+$/.test(encoded))
      throw new Error('Invalid encoding')

    const base64 = encoded.replaceAll('~', '+').replaceAll('_', '/')
    const bytes = Uint8Array.from(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')), char => char.charCodeAt(0))
    // Bound decompression before parsing untrusted shared links.
    const inflated = inflateSync(bytes, { out: new Uint8Array(maxPayloadBytes + 1) })
    if (inflated.length > maxPayloadBytes)
      throw new Error('Collection is too large')

    const [name, ids] = v.parse(sharedCollectionSchema, JSON.parse(strFromU8(inflated)))
    return { name, trackIds: ids }
  }
  catch {
    throw new Error('This collection link is invalid or incomplete. Ask the sender for a new link.')
  }
}

export function collectionShareUrl(collection: CollectionContent, origin: string) {
  return `${origin}/_/collections?c=${encodeCollection(collection)}`
}
