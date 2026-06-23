import { Schema } from 'effect'

export function Collection<T extends Schema.Schema<unknown>>(T: T) {
  return Schema.Struct({
    collection: Schema.Array(T),
    next_href: Schema.NullishOr(Schema.String),
    query_urn: Schema.NullishOr(Schema.String),
    total_results: Schema.optional(Schema.Number),
    variant: Schema.optional(Schema.String),
  })
}

export type Collection<T> = ReturnType<typeof Collection<Schema.Schema<T>>>['Type']
