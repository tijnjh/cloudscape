import { dev } from "$app/environment";
import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import { selectedInstance } from "$lib/global.svelte";
import ky, { type Input, type Options } from "ky";
import * as v from "valibot";

export async function $api<T = unknown>(
  input: Input,
  options?: Options & { schema: v.GenericSchema<T> },
) {
  if (!selectedInstance.current) {
    throw goto(resolve("/select-instance"));
  }

  const response = await ky
    .get(input, {
      baseUrl: selectedInstance.current,
      prefix: "/_/api/v2",
      ...options,
    })
    .json();

  if (options?.schema) {
    if (dev) {
      const { success, output, issues } = v.safeParse(options.schema, response);

      if (!success) {
        console.error(issues);
        throw new Error(v.summarize(issues));
      }

      return output;
    }

    return response as v.InferOutput<typeof options.schema>;
  }

  return response as T;
}

export function getPermalinkPath(...permalinks: string[]) {
  const permalinkUrl = `https://soundcloud.com/${permalinks.join("/")}`;
  const url = `/resolve?url=${encodeURIComponent(permalinkUrl)}` as const;
  return url;
}
