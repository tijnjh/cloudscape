import { Schema } from 'effect'

export const Comment = Schema.Struct({
  body: Schema.String,
  created_at: Schema.String,
  id: Schema.Number,
  kind: Schema.Literal('comment'),
  self: Schema.optional(
    Schema.Struct({
      urn: Schema.String,
    }),
  ),
  timestamp: Schema.NullOr(Schema.Number),
  track_id: Schema.Number,
  uri: Schema.String,
  user_id: Schema.Number,
})

export type Comment = typeof Comment.Type
