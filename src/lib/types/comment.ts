import type { User } from './user'

export interface Comment {
  body: string
  created_at: string
  id: number
  kind: 'comment'
  self?: {
    urn: string
  }
  timestamp: number | null
  track_id: number
  uri: string
  user: User
  user_id: number
}
