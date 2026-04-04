import { IsInViewport, watch } from "runed";
import type { Attachment } from "svelte/attachments";

export function whenInView(fn: VoidFunction): Attachment<HTMLElement> {
  return (node) => {
    const inViewport = new IsInViewport(() => node);
    watch(() => inViewport.current, fn);
  };
}

export const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});
