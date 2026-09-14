import type { WithPagination } from '$lib/types'
import type { Collection } from '$lib/types/collection'
import type { Comment } from '$lib/types/comment'
import type { Track } from '$lib/types/track'
import { max_items_per_page } from '$lib/constants'
import typia from 'typia'
import { $api, getPermalinkPath } from './utils'

export async function resolveTrack({
  user,
  track,
}: {
  user: string
  track: string
}) {
  return await $api(getPermalinkPath(user, track), {
    schema: typia.createAssert<Track>(),
  })
}

export async function getTrackById(id: number) {
  return await $api(`/tracks/${id}`, {
    schema: typia.createAssert<Track>(),
  })
}

export async function getTrackComments({
  id,
  offset,
  limit,
}: WithPagination<{ id: number }>) {
  return await $api(`/tracks/${id}/comments`, {
    searchParams: { limit, offset, sort: 'newest', threaded: 0 },
    schema: typia.createAssert<Collection<Comment>>(),
  })
}

export async function getTracksByIds(ids: number[]) {
  if (!ids.length) {
    return []
  }

  return await $api('/tracks', {
    searchParams: {
      ids: ids.join(','),
      limit: max_items_per_page,
    },
    schema: typia.createAssert<Track[]>(),
  })
}
