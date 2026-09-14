export interface Collection<T> {
  collection: T[]
  next_href?: string | null
  query_urn?: string | null
  total_results?: number
  variant?: string
}
