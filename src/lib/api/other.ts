import { PUBLIC_SOUNDCLOAK_INSTANCES_URL } from "$env/static/public";
import { SoundcloakInstance } from "$lib/schemas/soundcloak";

export async function getSoundcloakInstances() {
  return await (await fetch(PUBLIC_SOUNDCLOAK_INSTANCES_URL))
    .json() as SoundcloakInstance[];
}
