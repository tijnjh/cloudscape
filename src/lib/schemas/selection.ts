import { Schema } from 'effect'
import { Collection } from './collection'

export function Selection<T extends Schema.Schema<unknown>>(T: T) {
  return Schema.Struct({
    description: Schema.NullOr(Schema.String),
    id: Schema.String,
    items: Collection(T),
    kind: Schema.Literal('selection'),
    last_updated: Schema.NullOr(Schema.String),
    next_href: Schema.optional(Schema.String),
    query_urn: Schema.String,
    social_proof: Schema.NullOr(Schema.String),
    social_proof_users: Schema.NullOr(Schema.String),
    style: Schema.NullOr(Schema.String),
    title: Schema.String,
    tracking_feature_name: Schema.String,
    urn: Schema.String,
  })
}

export type Selection<T> = ReturnType<typeof Selection<Schema.Schema<T>>>['Type']
