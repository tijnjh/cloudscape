import type { WithPagination } from '$lib/types'
import type { Collection } from '$lib/types/collection'
import type { Playlist } from '$lib/types/playlist'
import type { Track } from '$lib/types/track'
import type { User } from '$lib/types/user'
import typia from 'typia'
import { $api } from './utils'

export async function searchAnything({
  query,
  offset,
  limit,
}: WithPagination<{ query: string }>) {
  return await $api('/search', {
    searchParams: { q: query, limit, offset },
    schema: typia.createAssert<Collection<Track | Playlist | User>>(),
  })
}

export async function searchTracks({
  query,
  offset,
  limit,
}: WithPagination<{ query: string }>) {
  return await $api('/search/tracks', {
    searchParams: { q: query, limit, offset },
    schema: typia.createAssert<Collection<Track>>(),
  })
}

export async function searchPlaylists({
  query,
  offset,
  limit,
}: WithPagination<{ query: string }>) {
  return await $api('/search/playlists', {
    searchParams: { q: query, limit, offset },
    schema: typia.createAssert<Collection<Playlist>>(),
  })
}

export async function searchUsers({
  query,
  offset,
  limit,
}: WithPagination<{ query: string }>) {
  return await $api('/search/users', {
    searchParams: { q: query, limit, offset },
    schema: typia.createAssert<Collection<User>>(),
  })
}
