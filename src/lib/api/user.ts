import type { WithPagination } from '$lib/types'
import type { Collection } from '$lib/types/collection'
import type { Playlist } from '$lib/types/playlist'
import type { Track } from '$lib/types/track'
import type { User } from '$lib/types/user'
import typia from 'typia'
import { $api, getPermalinkPath } from './utils'

export async function resolveUser(user: string) {
  return await $api(getPermalinkPath(user), {
    schema: typia.createAssert<User>(),
  })
}

export async function getUserById(id: number) {
  return await $api(`/users/${id}`, {
    schema: typia.createAssert<User>(),
  })
}

export async function getUserTracks({
  id,
  offset,
  limit,
}: WithPagination<{ id: number }>) {
  return await $api(`/users/${id}/tracks`, {
    searchParams: { limit, offset },
    schema: typia.createAssert<Collection<Track>>(),
  })
}

export async function getUserPlaylists({
  id,
  offset,
  limit,
}: WithPagination<{ id: number }>) {
  return await $api(`/users/${id}/playlists`, {
    searchParams: { limit, offset },
    schema: typia.createAssert<Collection<Playlist>>(),
  })
}
