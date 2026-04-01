import { dev } from "$app/environment";
import { scProxy } from "./utils.remote";
import { Result } from "better-result";
import { up } from "up-fetch";
import * as v from "valibot";

export const upfetch = up(fetch);

// const availableEndpoints = ["/mixed-selections", "/resolve", ] as const;

type AvailableEndpoints =
  | `/mixed-selections`
  | `/resolve?url=${string}`
  | `/users/${number}/tracks`
  | `/users/${number}/playlists`
  | `/tracks`
  | `/${"tracks" | "playlist" | "users"}/${number}`
  | `/tracks/${number}/related`
  | `/search/${"tracks" | "playlists" | "users"}`;

export async function scApi<S extends v.GenericSchema>(
  path: AvailableEndpoints,
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
  const response = await scProxy({ path, params, headers });

  if (dev) {
    const { success, output, issues } = v.safeParse(schema, response);

    if (!success) {
      return Result.err(v.summarize(issues));
    }

    return Result.ok(output);
  }

  return Result.ok(response as v.InferOutput<S>);
}

export function getPermalinkPath(...permalinks: string[]) {
  const permalinkUrl = `https://soundcloud.com/${permalinks.join("/")}`;
  const url = `/resolve?url=${encodeURIComponent(permalinkUrl)}` as const;
  return url;
}
