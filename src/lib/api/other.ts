import type { SoundcloakInstance } from '$lib/schemas/soundcloak'
import { PUBLIC_SOUNDCLOAK_INSTANCES_URL } from '$env/static/public'

export async function getSoundcloakInstances() {
  const res = await fetch(PUBLIC_SOUNDCLOAK_INSTANCES_URL)
  return (await res.json()) as SoundcloakInstance[]
}
