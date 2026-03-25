import { dev } from "$app/environment";
import { IsInViewport, watch } from "runed";
import type { Attachment } from "svelte/attachments";
import * as v from "valibot";

export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
  ref?: U | null;
};

export function whenInView(fn: VoidFunction): Attachment<HTMLElement> {
  return (node) => {
    const inViewport = new IsInViewport(() => node);
    watch(() => inViewport.current, fn);
  };
}

/**
 * @param schema in dev mode this is used to validate the response, in prod this is used to infer the type
 */
export function devSchema<T extends v.GenericSchema>(schema: T) {
  if (!dev) return undefined as unknown as T;
  return schema;
}
