import { dev } from "$app/environment";
import { up } from "up-fetch";
import * as v from "valibot";

export const upfetch = up(fetch);

export async function $api<S extends v.GenericSchema>(
  path: string,
  {
    schema,
    params,
    headers,
  }: {
    schema: S;
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
  },
) {
  const response = await upfetch(path, {
    baseUrl: "/api",
    params,
    headers,
  });

  if (dev) {
    const { success, output, issues } = v.safeParse(schema, response);

    if (!success) {
      throw new Error(v.summarize(issues));
    }

    return output;
  }

  return response as v.InferOutput<S>;
}

export function getPermalinkPath(...permalinks: string[]) {
  const permalinkUrl = `https://soundcloud.com/${permalinks.join("/")}`;
  const url = `/resolve?url=${encodeURIComponent(permalinkUrl)}` as const;
  return url;
}
