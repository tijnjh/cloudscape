import type Hls_typed from 'hls.js'

export async function getHls() {
  // @ts-expect-error they don't have types (yet)
  const { default: Hls_untyped } = await import('hls.js/light')
  return Hls_untyped as typeof Hls_typed
}
