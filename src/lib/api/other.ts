import type { SoundcloakInstance } from '$lib/schemas/soundcloak'

export async function getSoundcloakInstances() {
  const instancesUrl
    = import.meta.env.PUBLIC_SOUNDCLOAK_INSTANCES_URL
      || import.meta.env.VITE_SOUNDCLOAK_INSTANCES_URL

  if (!instancesUrl) {
    throw new Error('No Soundcloak instances URL configured')
  }

  const res = await fetch(instancesUrl)
  return (await res.json()) as SoundcloakInstance[]
}
