import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import { selectedInstance } from "$lib/global.svelte";
import * as v from "valibot";

interface Init<TSchema extends v.GenericSchema> extends RequestInit {
  schema?: TSchema;
  searchParams?: SearchParams;
}

interface SearchParams {
  [key: string]: string | number | boolean | undefined | null;
}

function formatSearchParams(o: SearchParams) {
  return (
    "?" +
    Object.entries(o)
      .filter(([, v]) => v != null)
      .map(
        ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
      )
      .join("&")
  );
}

export async function $api<TSchema extends v.GenericSchema>(
  input: string,
  { schema, searchParams, ...baseInit }: Init<TSchema> = {},
) {
  if (!selectedInstance.current) {
    throw goto(resolve("/_/preferences/instance"));
  }

  const url = [
    selectedInstance.current,
    "/_/api/v2",
    input,
    searchParams && formatSearchParams(searchParams),
  ]
    .filter(Boolean)
    .join("");

  const res = await (await fetch(url, baseInit)).json();

  if (schema && import.meta.env.dev) {
    return v.parse(schema, res);
  }

  return res as v.InferOutput<TSchema>;
}

export function getPermalinkPath(...permalinks: string[]) {
  const permalinkUrl = `https://soundcloud.com/${permalinks.join("/")}`;
  const url = `/resolve?url=${encodeURIComponent(permalinkUrl)}` as const;
  return url;
}
