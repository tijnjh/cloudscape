import { getClientId } from "$lib/api/utils";
import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { up } from "up-fetch";

export const GET: RequestHandler = async (e) => {
  const pathname = e.url.pathname.replace("/api", "");

  const response = await up(e.fetch)(pathname, {
    baseUrl: "https://api-v2.soundcloud.com",
    params: {
      client_id: await getClientId((url) =>
        e.fetch(url).then((res) => res.text()),
      ),
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
