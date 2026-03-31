import { query } from "$app/server";
import { devSchema } from "$lib/utils";
import ky from "../../../node_modules/ky/source";
import { getTrackById } from "./track.remote";
import { getClientId } from "./utils";
import * as v from "valibot";

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

  const { url } = await ky(transcoding.url, {
    searchParams: {
      track_authorization: track.track_authorization,
      client_id: clientId,
    },
  }).json(
    devSchema(
      v.object({
        url: v.union([v.string(), v.array(v.string())]),
      }),
    ),
  );

  return Array.isArray(url) ? url[0] : url;
});
