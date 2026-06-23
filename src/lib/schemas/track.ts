import { Schema as S } from 'effect'

export const Track = S.Struct({
  artwork_url: S.NullOr(S.String),
  caption: S.NullOr(S.String),
  comment_count: S.NullOr(S.Number),
  commentable: S.Boolean,
  created_at: S.String,
  description: S.NullOr(S.String),
  display_date: S.String,
  download_count: S.NullOr(S.Number),
  downloadable: S.Boolean,
  duration: S.Number,
  embeddable_by: S.Literals(['all', 'none', 'me'] as const),
  full_duration: S.Number,
  genre: S.NullOr(S.String),
  has_downloads_left: S.Boolean,
  id: S.Number,
  kind: S.Literal('track'),
  label_name: S.NullOr(S.String),
  last_modified: S.String,
  license: S.String,
  likes_count: S.NullOr(S.Number),

  media: S.Struct({
    transcodings: S.Array(
      S.Struct({
        url: S.String,
        preset: S.Literals([
          'opus_0_0',
          'aac_96k',
          'aac_160k',
          'mp3_0_0',
          'abr_sq',
          'mp3_1_0',
          'mp3_0_1',
          'mp3_standard',
        ] as const),
        duration: S.Number,
        snipped: S.Boolean,
        format: S.Struct({
          protocol: S.Literals([
            'hls',
            'progressive',
            'ctr-encrypted-hls',
            'cbc-encrypted-hls',
          ] as const),
          mime_type: S.Literals([
            'audio/mp4; codecs="mp4a.40.2"',
            'audio/mpegurl',
            'audio/mpeg',
            'audio/ogg; codecs="opus"',
          ] as const),
        }),
        quality: S.Literals(['sq', 'lq'] as const),
        is_legacy_transcoding: S.Boolean,
      }),
    ),
  }),

  monetization_model: S.Literals([
    'AD_SUPPORTED',
    'BLACKBOX',
    'NOT_APPLICABLE',
    'SUB_HIGH_TIER',
  ] as const),

  permalink: S.String,
  permalink_url: S.String,
  playback_count: S.NullOr(S.Number),
  policy: S.Literals(['MONETIZE', 'BLOCK', 'SNIP', 'ALLOW'] as const),
  public: S.Boolean,

  publisher_metadata: S.NullOr(
    S.Struct({
      id: S.Number,
      urn: S.String,
      artist: S.optional(S.String),
      publisher: S.optional(S.String),
      album_title: S.optional(S.String),
      contains_music: S.optional(S.Boolean),
      upc_or_ean: S.optional(S.String),
      iswc: S.optional(S.String),
      isrc: S.optional(S.String),
      explicit: S.optional(S.Boolean),
      p_line: S.optional(S.String),
      p_line_for_display: S.optional(S.String),
      c_line: S.optional(S.String),
      c_line_for_display: S.optional(S.String),
      writer_composer: S.optional(S.String),
      release_title: S.optional(S.String),
    }),
  ),

  purchase_title: S.NullOr(S.String),
  purchase_url: S.NullOr(S.String),
  release_date: S.NullOr(S.String),
  reposts_count: S.Number,
  secret_token: S.NullOr(S.String),
  sharing: S.Literals(['public', 'private'] as const),
  state: S.Literals(['finished', 'processing'] as const),
  station_permalink: S.String,
  station_urn: S.String,
  streamable: S.Boolean,
  tag_list: S.String,
  title: S.String,
  track_authorization: S.String,
  uri: S.String,
  urn: S.String,
  user: S.String,
  user_id: S.Number,

  visuals: S.NullOr(
    S.Struct({
      urn: S.String,
      enabled: S.Boolean,
      visuals: S.Array(
        S.Struct({
          urn: S.String,
          entry_time: S.Number,
          visual_url: S.String,
          link: S.optional(S.String),
        }),
      ),
      tracking: S.Null,
    }),
  ),

  waveform_url: S.String,
})

export type Track = typeof Track.Type
