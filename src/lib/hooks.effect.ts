import type { RequestEvent, ResolveOptions } from "@sveltejs/kit";
import { Effect } from "effect";

export type MaybePromise<T> = Promise<T> | T;

/**
 * Define a hook using an `Effect`.
 */
export const effectfulHook =
  <R, Input extends unknown[]>(fn: (...input: Input) => Effect.Effect<R>) =>
  (...input: Input) =>
    Effect.runPromise(fn(...input));

export const effectfulResolve = (
  resolve: (
    event: RequestEvent,
    opts?: ResolveOptions,
  ) => MaybePromise<Response>,
  event: RequestEvent,
  opts?: ResolveOptions,
) => {
  if (resolve instanceof Promise) {
    return Effect.promise(() => resolve(event, opts) as Promise<Response>);
  } else {
    return Effect.sync(
      () => resolve(event, opts) as Awaited<Promise<Response>>,
    );
  }
};
