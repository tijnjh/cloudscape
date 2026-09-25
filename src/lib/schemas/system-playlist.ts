import * as v from 'valibot'
import { Track } from './track'
import { User } from './user'

export const SystemPlaylist = v.object({
  artwork_url: v.nullable(v.string()),
  calculated_artwork_url: v.nullable(v.string()),
  description: v.string(),
  id: v.string(),
  is_public: v.boolean(),
  kind: v.literal('system-playlist'),
  last_updated: v.nullable(v.string()),
  likes_count: v.number(),
  made_for: v.nullable(v.unknown()),
  permalink: v.string(),
  permalink_url: v.string(),
  playlist_type: v.string(),
  query_urn: v.string(),
  seed: v.nullable(v.unknown()),
  short_description: v.string(),
  short_title: v.string(),
  title: v.string(),
  tracking_feature_name: v.string(),
  tracks: v.array(
    v.pick(Track, [
      'id',
      'kind',
      'monetization_model',
      'policy',
    ]),
  ),
  urn: v.string(),
  user: User,
})

export type SystemPlaylist = v.InferOutput<typeof SystemPlaylist>
