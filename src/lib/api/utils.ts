import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import { selectedInstance } from "$lib/global.svelte";
import ky from "ky";

export const $api = ky.create({
  baseUrl: selectedInstance.current,
  prefix: "/_/api/v2",
  hooks: {
    beforeRequest: [
      ({ request }) => {
        if (!selectedInstance.current) {
          throw goto(resolve("/select-instance"));
        }

        return request;
      },
    ],
  },
});

export function getPermalinkPath(...permalinks: string[]) {
  const permalinkUrl = `https://soundcloud.com/${permalinks.join("/")}`;
  const url = `/resolve?url=${encodeURIComponent(permalinkUrl)}` as const;
  return url;
}
