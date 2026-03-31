import type { Transport } from "@sveltejs/kit";
import { Err, Ok, Result } from "better-result";

function isResult(obj: unknown): obj is Result<unknown, unknown> {
  return obj instanceof Ok || obj instanceof Err;
}

export const transport: Transport = {
  Result: {
    encode: (o) => (isResult(o) ? Result.serialize(o) : null),
    decode: Result.deserialize,
  },
};
