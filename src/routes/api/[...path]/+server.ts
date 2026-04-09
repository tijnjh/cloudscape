import { upfetch } from "$lib/api/utils.js";
import { getClientId } from "$lib/api/utils.remote.js";
import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async (e) => {
  const pathname = e.url.pathname.replace("/api", "");

  const response = await upfetch(pathname, {
    baseUrl: "https://api-v2.soundcloud.com",
    params: {
      client_id: await getClientId(),
      ...Object.fromEntries(e.url.searchParams),
    },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
      ...Object.fromEntries(e.request.headers),
    },
  });

  return json(response);
};
