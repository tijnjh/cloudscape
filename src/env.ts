import { defineEnvVars } from "@sveltejs/kit/hooks";
import * as v from "valibot";

export const variables = defineEnvVars({
  SOUNDCLOAK_INSTANCES_URL: {
    public: true,
    static: true,
    schema: v.optional(
      v.pipe(v.string(), v.url()),
      "https://maid.zone/soundcloak/instances.json",
    ),
  },
  DEFAULT_INSTANCE: {
    public: true,
    static: true,
    schema: v.optional(v.pipe(v.string(), v.url())),
  },
});
