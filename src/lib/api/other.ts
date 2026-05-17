import { PUBLIC_SOUNDCLOAK_INSTANCES_URL } from "$env/static/public";
import { SoundcloakInstance } from "$lib/schemas/soundcloak";
import ky from "ky";
import * as v from "valibot";

export async function getSoundcloakInstances() {
  return await ky
    .get(PUBLIC_SOUNDCLOAK_INSTANCES_URL)
    .json(v.array(SoundcloakInstance));
}
