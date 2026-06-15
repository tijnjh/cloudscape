import type { WithPagination } from '$lib/types'
import { max_items_per_page } from '$lib/constants'
import { Collection } from '$lib/schemas/collection'
import { Comment } from '$lib/schemas/comment'
import { Track } from '$lib/schemas/track'
import * as v from 'valibot'
import { $api, getPermalinkPath } from './utils'

export async function resolveTrack({
  user,
  track,
}: {
  user: string
  track: string
}) {
  return await $api(getPermalinkPath(user, track), { schema: Track })
}

export async function getTrackById(id: number) {
  return await $api(`/tracks/${id}`, { schema: Track })
}

export async function getTrackComments({
  id,
  offset,
  limit,
}: WithPagination<{ id: number }>) {
  return await $api(`/tracks/${id}/comments`, {
    searchParams: { limit, offset, sort: 'newest', threaded: 0 },
    schema: Collection(Comment),
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
    schema: v.array(Track),
  })
}
