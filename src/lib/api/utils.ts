import { dev } from "$app/environment";
import { PUBLIC_API_URL } from "$env/static/public";
import { up } from "up-fetch";
import * as v from "valibot";

export const upfetch = up(fetch);

export async function $api<T = unknown>(
  path: string,
  {
    schema,
    params,
    headers,
  }: {
    schema?: v.GenericSchema<T>;
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
  } = {},
) {
  // const response = await scProxy({ path, params, headers });

  const response = await upfetch(path, {
    baseUrl: PUBLIC_API_URL,
    params,
    headers,
  });

  if (schema) {
    if (dev) {
      const { success, output, issues } = v.safeParse(schema, response);

      if (!success) {
        console.error(issues);
        throw new Error(v.summarize(issues));
      }

      return output;
    }

    return response as v.InferOutput<typeof schema>;
  }

  return response as T;
}

export function getPermalinkPath(...permalinks: string[]) {
  const permalinkUrl = `https://soundcloud.com/${permalinks.join("/")}`;
  const url = `/resolve?url=${encodeURIComponent(permalinkUrl)}` as const;
  return url;
}
