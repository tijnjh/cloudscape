import { PUBLIC_SOUNDCLOAK_INSTANCES_URL } from "$env/static/public";
import { SoundcloakInstance } from "$lib/schemas/soundcloak";

export async function getSoundcloakInstances() {
  const res = await fetch(PUBLIC_SOUNDCLOAK_INSTANCES_URL);
  return (await res.json()) as SoundcloakInstance[];
}
