import type { paths } from '$lib/client/schema'
import { selectedInstanceAtom } from '$lib/atoms'
import { getDefaultStore } from 'jotai'
import createFetchClient from 'openapi-fetch'
import createClient from 'openapi-react-query'

const selectedInstance = getDefaultStore().get(selectedInstanceAtom)

export const api = createFetchClient<paths>({
  baseUrl: selectedInstance,

})
export const $api = createClient(api)
