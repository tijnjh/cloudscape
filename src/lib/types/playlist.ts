import type { Track } from './track'
import type { User } from './user'

export interface Playlist {
  artwork_url: string | null
  created_at: string
  description?: string | null
  display_date: string
  duration: number
  embeddable_by?: 'all' | 'none' | 'me'
  genre?: string | null
  id: number
  is_album: boolean
  kind: 'playlist'
  label_name?: string | null
  last_modified: string
  license?: string
  likes_count: number | null
  managed_by_feeds: boolean
  permalink: string
  permalink_url: string
  public: boolean
  published_at: string | null
  purchase_title?: string | null
  purchase_url?: string | null
  release_date: string | null
  reposts_count: number
  secret_token: string | null
  set_type: string
  sharing: 'public' | 'private'
  tag_list?: string
  title: string
  track_count: number
  tracks?: Array<Track | Pick<Track, 'id' | 'kind' | 'monetization_model' | 'policy'>>
  uri: string
  user: User
  user_id: number
}
