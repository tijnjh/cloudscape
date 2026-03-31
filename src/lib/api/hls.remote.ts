import { query } from "$app/server";
import { devSchema } from "$lib/utils";
import ky from "../../../node_modules/ky/source";
import { getTrackById } from "./track.remote";
import { getClientId } from "./utils";
import { Result } from "better-result";
import * as v from "valibot";

export const getTrackSource = query(v.number(), async (trackId) => {
  const track = await getTrackById(trackId);
  const clientId = await getClientId();

  if (!track) {
    return Result.err(new Error("failed to find track"));
  }

  if (track.isErr()) {
    return track.error;
  }

  const hlsTranscodings = track.value.media.transcodings.filter(
    (t) => t.format.protocol === "hls",
  );

  const transcoding =
    hlsTranscodings.find((t) => t.preset === "aac_160k") ??
    hlsTranscodings.find((t) => t.format.mime_type === "audio/mpeg");

  if (!transcoding) {
    return Result.err(new Error("failed to find hls transcoding"));
  }

  const { url } = await ky(transcoding.url, {
    searchParams: {
      track_authorization: track.value.track_authorization,
      client_id: clientId,
    },
  }).json(
    devSchema(
      v.object({
        url: v.union([v.string(), v.array(v.string())]),
      }),
    ),
  );

  return Result.ok(Array.isArray(url) ? url[0] : url);
});
