import { query } from "$app/server";
import { getTrackById } from "./track";
import { upfetch } from "./utils";
import * as v from "valibot";

export const scProxy = query(
  v.object({
    path: v.string(),
    params: v.optional(v.record(v.string(), v.unknown())),
    headers: v.optional(v.record(v.string(), v.string())),
  }),
  async ({ path, params, headers }) => {
    return upfetch(path, {
      baseUrl: "https://api-v2.soundcloud.com",
      params: {
        client_id: await getClientId(),
        ...params,
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
        ...headers,
      },
    });
  },
);

let clientId: string;
let clientIdExpiry: number;

export const getTrackSource = query(v.number(), async (trackId) => {
  const track = await getTrackById(trackId);
  const clientId = await getClientId();

  if (!track) {
    throw new Error("failed to find track");
  }

  const hlsTranscodings = track.media.transcodings.filter(
    (t) => t.format.protocol === "hls",
  );

  const transcoding =
    hlsTranscodings.find((t) => t.preset === "aac_160k") ??
    hlsTranscodings.find((t) => t.format.mime_type === "audio/mpeg");

  if (!transcoding) {
    throw new Error("failed to find hls transcoding");
  }

  const { url } = await upfetch(transcoding.url, {
    params: {
      track_authorization: track.track_authorization,
      client_id: clientId,
    },
    schema: v.object({
      url: v.union([v.string(), v.array(v.string())]),
    }),
  });

  return Array.isArray(url) ? url[0] : url;
});

export const getClientId = query(async () => {
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
});
