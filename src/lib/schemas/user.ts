// import * as v from 'valibot'

import { Schema } from 'effect'

export const User = Schema.Struct({
  avatar_url: Schema.String,
  badges: Schema.Struct({
    pro: Schema.Boolean,
    creator_mid_tier: Schema.Boolean,
    pro_unlimited: Schema.Boolean,
    verified: Schema.Boolean,
  }),
  city: Schema.NullOr(Schema.String),
  comments_count: Schema.optional(Schema.Number),
  country_code: Schema.NullOr(Schema.String),
  created_at: Schema.NullishOr(Schema.String),
  creator_subscription: Schema.optional(
    Schema.Struct({
      product: Schema.Struct({
        id: Schema.String,
      }),
    }),
  ),
  creator_subscriptions: Schema.optional(
    Schema.Array(
      Schema.Struct({
        product: Schema.Struct({
          id: Schema.String,
        }),
      }),
    ),
  ),
  date_of_birth: Schema.optional(Schema.NullOr(Schema.String)),
  description: Schema.optional(Schema.NullOr(Schema.String)),
  first_name: Schema.String,
  followers_count: Schema.Number,
  followings_count: Schema.optional(Schema.Number),
  full_name: Schema.String,
  groups_count: Schema.optional(Schema.Number),
  id: Schema.Number,
  kind: Schema.Literal('user'),
  last_modified: Schema.String,
  last_name: Schema.String,
  likes_count: Schema.optional(Schema.Number),
  permalink: Schema.String,
  permalink_url: Schema.String,
  playlist_count: Schema.optional(Schema.Number),
  playlist_likes_count: Schema.optional(Schema.Number),
  reposts_count: Schema.optional(Schema.NullOr(Schema.Number)),
  station_permalink: Schema.optional(Schema.String),
  station_urn: Schema.optional(Schema.String),
  track_count: Schema.optional(Schema.Number),
  uri: Schema.String,
  urn: Schema.String,
  username: Schema.String,
  verified: Schema.Boolean,
  visuals: Schema.NullishOr(
    Schema.Struct({
      urn: Schema.String,
      enabled: Schema.Boolean,
      visuals: Schema.Array(
        Schema.Struct({
          urn: Schema.String,
          entry_time: Schema.Number,
          visual_url: Schema.String,
          link: Schema.optional(Schema.String),
        }),
      ),
      tracking: Schema.Null,
    }),
  ),
})

// export const User = v.strictObject({
//   avatar_url: v.pipe(v.string(), v.url()),
//   badges: v.strictObject({
//     pro: v.boolean(),
//     creator_mid_tier: v.boolean(),
//     pro_unlimited: v.boolean(),
//     verified: v.boolean(),
//   }),
//   city: v.nullable(v.string()),
//   comments_count: v.optional(v.number()),
//   country_code: v.nullable(v.string()),
//   created_at: v.nullish(v.pipe(v.string(), v.isoTimestamp())),
//   creator_subscription: v.optional(
//     v.strictObject({
//       product: v.strictObject({
//         id: v.string(),
//       }),
//     }),
//   ),
//   creator_subscriptions: v.optional(
//     v.array(
//       v.strictObject({
//         product: v.strictObject({
//           id: v.string(),
//         }),
//       }),
//     ),
//   ),
//   date_of_birth: v.optional(v.nullable(v.string())),
//   description: v.optional(v.nullable(v.string())),
//   first_name: v.string(),
//   followers_count: v.number(),
//   followings_count: v.optional(v.number()),
//   full_name: v.string(),
//   groups_count: v.optional(v.number()),
//   id: v.number(),
//   kind: v.literal('user'),
//   last_modified: v.pipe(v.string(), v.isoTimestamp()),
//   last_name: v.string(),
//   likes_count: v.optional(v.number()),
//   permalink: v.string(),
//   permalink_url: v.pipe(v.string(), v.url()),
//   playlist_count: v.optional(v.number()),
//   playlist_likes_count: v.optional(v.number()),
//   reposts_count: v.optional(v.nullable(v.number())),
//   station_permalink: v.optional(v.string()),
//   station_urn: v.optional(v.string()),
//   track_count: v.optional(v.number()),
//   uri: v.pipe(v.string(), v.url()),
//   urn: v.string(),
//   username: v.string(),
//   verified: v.boolean(),
//   visuals: v.nullish(
//     v.strictObject({
//       urn: v.string(),
//       enabled: v.boolean(),
//       visuals: v.array(
//         v.strictObject({
//           urn: v.string(),
//           entry_time: v.number(),
//           visual_url: v.pipe(v.string(), v.url()),
//           link: v.optional(v.string()),
//         }),
//       ),
//       tracking: v.null(),
//     }),
//   ),
// })

// export type User = v.InferOutput<typeof User>
