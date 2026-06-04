import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import { selectedInstance } from "$lib/global.svelte";

interface Init extends RequestInit {
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

export async function $api<T>(
  input: string,
  { searchParams, ...baseInit }: Init = {},
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

  return res as T;
}

export function getPermalinkPath(...permalinks: string[]) {
  const permalinkUrl = `https://soundcloud.com/${permalinks.join("/")}`;
  const url = `/resolve?url=${encodeURIComponent(permalinkUrl)}` as const;
  return url;
}
