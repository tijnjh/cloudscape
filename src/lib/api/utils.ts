import { dev } from "$app/environment";
import { up } from "up-fetch";

let clientId: string;
let clientIdExpiry: number;

export const upfetch = up(fetch);

export const $api = up(fetch, async () => ({
  baseUrl: "https://api-v2.soundcloud.com",
  params: {
    client_id: await getClientId(),
  },
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
  },
}));
export async function getClientId() {
  if (clientId && Date.now() < clientIdExpiry) return clientId;

  const html = await (await fetch("https://soundcloud.com")).text();

  const scriptUrls = [
    ...html.matchAll(
      /<script crossorigin src="(https:\/\/a-v2\.sndcdn\.com\/assets\/[^"]+\.js)"><\/script>/g,
    ),
  ].map((m) => m[1]);

  if (scriptUrls.length === 0) {
    throw new Error("script not found");
  }

  for (const scriptUrl of scriptUrls) {
    const script = await (await fetch(scriptUrl)).text();

    const id = script.match(/client_id:"([A-Za-z0-9]{32})"/)?.[1];

    if (id) {
      clientId = id;
      clientIdExpiry = Date.now() + 30 * 60 * 1000;
      return clientId;
    }
  }

  throw new Error("client id not found");
}

export function getPermalinkPath(...permalinks: string[]) {
  const permalinkUrl = `https://soundcloud.com/${permalinks.join("/")}`;
  const url = `/resolve?url=${encodeURIComponent(permalinkUrl)}`;
  return url;
}
