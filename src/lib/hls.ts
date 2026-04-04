import type Hls_typed from "hls.js";
// @ts-expect-error they don't have types (yet)
import Hls_untyped from "hls.js/light";

export const Hls = Hls_untyped as typeof Hls_typed;
