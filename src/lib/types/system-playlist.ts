import type { Track } from './track'
import type { User } from './user'

export interface SystemPlaylist {
  artwork_url: string | null
  calculated_artwork_url: string | null
  description: string
  id: string
  is_public: boolean
  kind: 'system-playlist'
  last_updated: string | null
  likes_count: number
  made_for: unknown | null
  permalink: string
  permalink_url: string
  playlist_type: string
  query_urn: string
  seed: unknown | null
  short_description: string
  short_title: string
  title: string
  tracking_feature_name: string
  tracks: Pick<Track, 'id' | 'kind' | 'monetization_model' | 'policy'>[]
  urn: string
  user: User
}
