import { SOUNDCLOAK_INSTANCES_URL } from "$app/env/public";
import { SoundcloakInstance } from "$lib/schemas/soundcloak";

export async function getSoundcloakInstances() {
  const res = await fetch(SOUNDCLOAK_INSTANCES_URL);
  return (await res.json()) as SoundcloakInstance[];
}
