import type { SoundcloakInstance } from '$lib/schemas/soundcloak'

export async function getSoundcloakInstances() {
  const res = await fetch(import.meta.env.PUBLIC_SOUNDCLOAK_INSTANCES_URL)
  return (await res.json()) as SoundcloakInstance[]
}
