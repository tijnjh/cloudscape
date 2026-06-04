import { PUBLIC_SOUNDCLOAK_INSTANCES_URL } from "$env/static/public";
import type { SoundcloakInstance } from "$lib/types/soundcloak";

export async function getSoundcloakInstances() {
  return (await (
    await fetch(PUBLIC_SOUNDCLOAK_INSTANCES_URL)
  ).json()) as SoundcloakInstance[];
}
