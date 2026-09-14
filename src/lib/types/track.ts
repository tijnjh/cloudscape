import type { User } from './user'

export interface Track {
  artwork_url: string | null
  caption: string | null
  comment_count: number | null
  commentable: boolean
  created_at: string
  description: string | null
  display_date: string
  download_count: number | null
  downloadable: boolean
  duration: number
  embeddable_by: 'all' | 'none' | 'me'
  full_duration: number
  genre: string | null
  has_downloads_left: boolean
  id: number
  kind: 'track'
  label_name: string | null
  last_modified: string
  license: string
  likes_count: number | null
  media: {
    transcodings: {
      url: string
      preset: 'opus_0_0' | 'aac_96k' | 'aac_160k' | 'mp3_0_0' | 'abr_sq' | 'mp3_1_0' | 'mp3_0_1' | 'mp3_standard'
      duration: number
      snipped: boolean
      format: {
        protocol: 'hls' | 'progressive' | 'ctr-encrypted-hls' | 'cbc-encrypted-hls'
        mime_type: 'audio/mp4; codecs="mp4a.40.2"' | 'audio/mpegurl' | 'audio/mpeg' | 'audio/ogg; codecs="opus"'
      }
      quality: 'sq' | 'lq'
      is_legacy_transcoding: boolean
    }[]
  }
  monetization_model: 'AD_SUPPORTED' | 'BLACKBOX' | 'NOT_APPLICABLE' | 'SUB_HIGH_TIER'
  permalink: string
  permalink_url: string
  playback_count: number | null
  policy: 'MONETIZE' | 'BLOCK' | 'SNIP' | 'ALLOW'
  public: boolean
  publisher_metadata: {
    id: number
    urn: string
    artist?: string
    publisher?: string
    album_title?: string
    contains_music?: boolean
    upc_or_ean?: string
    iswc?: string
    isrc?: string
    explicit?: boolean
    p_line?: string
    p_line_for_display?: string
    c_line?: string
    c_line_for_display?: string
    writer_composer?: string
    release_title?: string
  } | null
  purchase_title: string | null
  purchase_url: string | null
  release_date: string | null
  reposts_count: number
  secret_token: string | null
  sharing: 'public' | 'private'
  state: 'finished' | 'processing'
  station_permalink: string
  station_urn: string
  streamable: boolean
  tag_list: string
  title: string
  track_authorization: string
  uri: string
  user: User
  urn: string
  user_id: number
  visuals: {
    urn: string
    enabled: boolean
    visuals: {
      urn: string
      entry_time: number
      visual_url: string
      link?: string
    }[]
    tracking: null
  } | null
  waveform_url: string
}
