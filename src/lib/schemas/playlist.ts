import { Schema } from 'effect'
import { Track } from './track'
import { User } from './user'

export const Playlist = Schema.Struct({
  artwork_url: Schema.NullOr(Schema.String),
  created_at: Schema.String,
  description: Schema.optional(Schema.String),
  display_date: Schema.String,
  duration: Schema.Number,
  embeddable_by: Schema.Literals(['all', 'none', 'me']),
  genre: Schema.optional(Schema.NullOr(Schema.String)),
  id: Schema.Number,
  is_album: Schema.Boolean,
  kind: Schema.Literal('playlist'),
  label_name: Schema.optional(Schema.NullOr(Schema.String)),
  last_modified: Schema.String,
  license: Schema.optional(Schema.String),
  likes_count: Schema.NullOr(Schema.Number),
  managed_by_feeds: Schema.Boolean,
  permalink: Schema.String,
  permalink_url: Schema.String,
  public: Schema.Boolean,
  published_at: Schema.NullOr(Schema.String),
  purchase_title: Schema.optional(Schema.NullOr(Schema.String)),
  purchase_url: Schema.NullishOr(Schema.String),
  release_date: Schema.NullOr(Schema.String),
  reposts_count: Schema.Number,
  secret_token: Schema.NullOr(Schema.String),
  set_type: Schema.String,
  sharing: Schema.Literals(['public', 'private']),
  tag_list: Schema.optional(Schema.String),
  title: Schema.String,
  track_count: Schema.Number,
  tracks: Schema.optional(
    Schema.Array(Track),
  ),
  uri: Schema.String,
  user: User,
  user_id: Schema.Number,
})

export type Playlist = typeof Playlist.Type
