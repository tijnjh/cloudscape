import { getTrackById } from "./track.remote";
import { getClientId, upfetch } from "./utils/api";
import { effectfulQuery } from "./utils/remote-functions.effect";
import { Effect, Schema } from "effect";

export const getTrackSource = effectfulQuery(
  Schema.Number,
  Effect.fn(function* (trackId) {
    const track = yield* Effect.tryPromise(() => getTrackById(trackId));
    const clientId = yield* Effect.tryPromise(getClientId);

    if (!track) {
      return yield* Effect.fail(new Error("failed to find track"));
    }

    const hlsTranscodings = track.media.transcodings.filter(
      (t) => t.format.protocol === "hls",
    );
    const transcoding =
      hlsTranscodings.find((t) => t.preset === "aac_160k") ??
      hlsTranscodings.find((t) => t.format.mime_type === "audio/mpeg");
    if (!transcoding) {
      return yield* Effect.fail(new Error("failed to find hls transcoding"));
    }
    const { url } = yield* Effect.tryPromise(() =>
      upfetch(transcoding.url, {
        params: {
          track_authorization: track.track_authorization,
          client_id: clientId,
        },
        schema: Schema.standardSchemaV1(
          Schema.Struct({
            url: Schema.Union(Schema.String, Schema.Array(Schema.String)),
          }),
        ),
      }),
    );
    return Array.isArray(url) ? url[0] : url;
  }),
);
