import * as v from 'valibot'
import { User } from './user'

export const Comment = v.strictObject({
  body: v.string(),
  created_at: v.pipe(v.string(), v.isoTimestamp()),
  id: v.number(),
  kind: v.literal('comment'),
  self: v.optional(
    v.strictObject({
      urn: v.string(),
    }),
  ),
  timestamp: v.nullable(v.number()),
  track_id: v.number(),
  uri: v.pipe(v.string(), v.url()),
  user: User,
  user_id: v.number(),
})

export type Comment = v.InferOutput<typeof Comment>
