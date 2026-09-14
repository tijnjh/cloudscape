export interface User {
  avatar_url: string
  badges: {
    pro: boolean
    creator_mid_tier: boolean
    pro_unlimited: boolean
    verified: boolean
  }
  city: string | null
  comments_count?: number
  country_code: string | null
  created_at?: string | null
  creator_subscription?: {
    product: {
      id: string
    }
  }
  creator_subscriptions?: {
    product: {
      id: string
    }
  }[]
  date_of_birth?: string | null
  description?: string | null
  first_name: string
  followers_count: number
  followings_count?: number
  full_name: string
  groups_count?: number
  id: number
  kind: 'user'
  last_modified: string
  last_name: string
  likes_count?: number
  permalink: string
  permalink_url: string
  playlist_count?: number
  playlist_likes_count?: number
  reposts_count?: number | null
  station_permalink?: string
  station_urn?: string
  track_count?: number
  uri: string
  urn: string
  username: string
  verified: boolean
  visuals?: {
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
}
