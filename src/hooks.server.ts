import { effectfulHook } from "$lib/hooks.effect";
import type { ServerInit } from "@sveltejs/kit";
import { Effect } from "effect";

export const init: ServerInit = effectfulHook(() =>
  Effect.logInfo("Server started :)"),
);
