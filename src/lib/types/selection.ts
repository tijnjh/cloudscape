export interface Selection<T> {
  description: string | null
  id: string
  items: {
    collection: T[]
    next_href?: string | null
    query_urn?: string | null
    total_results?: number
    variant?: string
  }
  kind: 'selection'
  last_updated: string | null
  next_href?: string
  query_urn: string
  social_proof: string | null
  social_proof_users: string | null
  style: string | null
  title: string
  tracking_feature_name: string
  urn: string
}
