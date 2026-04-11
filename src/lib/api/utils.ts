import { dev } from "$app/environment";
import { getTrackById } from "./track";
import { $fetch } from "./utils.remote";
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
  const response = await upfetch(`/api${path}`, {
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

export async function getTrackSource(trackId: number) {
  const track = await getTrackById(trackId);
  const clientId = await getClientId((input) =>
    $fetch({ input, output: "text" }).run(),
  );

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
}

let clientId: string;
let clientIdExpiry: number;

export async function getClientId(
  textFetchFn: (input: string) => Promise<string>,
) {
  if (clientId && Date.now() < clientIdExpiry) return clientId;

  const html = await textFetchFn("https://soundcloud.com");

  const scriptUrls = [
    ...html.matchAll(
      /<script crossorigin src="(https:\/\/a-v2\.sndcdn\.com\/assets\/[^"]+\.js)"><\/script>/g,
    ),
  ].map((m) => m[1]);

  if (scriptUrls.length === 0) {
    throw new Error("script not found");
  }

  for (const scriptUrl of scriptUrls) {
    const script = await textFetchFn(scriptUrl);

    const id = script.match(/client_id:"([A-Za-z0-9]{32})"/)?.[1];

    if (id) {
      clientId = id;
      clientIdExpiry = Date.now() + 30 * 60 * 1000;
      return clientId;
    }
  }

  throw new Error("client id not found");
}
