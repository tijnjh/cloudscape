import { IsInViewport, watch } from "runed";
import type { Attachment } from "svelte/attachments";

export function whenInView(fn: VoidFunction): Attachment<HTMLElement> {
  return (element) => {
    const isInViewport = new IsInViewport(() => element);
    watch(() => isInViewport.current, fn);
  };
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatDate(date?: Date | string | null | undefined) {
  if (!date) return;
  const normalizedDate = typeof date === "string" ? new Date(date) : date;
  return dateFormatter.format(normalizedDate);
}
