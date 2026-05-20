import { page } from "$app/state";
import { IsInViewport, watch } from "runed";
import type { Attachment } from "svelte/attachments";

export function whenInView(fn: VoidFunction): Attachment<HTMLElement> {
  return (node) => {
    const inViewport = new IsInViewport(() => node);
    watch(() => inViewport.current, fn);
  };
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatDate(date: Date | string) {
  const normalizedDate = typeof date === "string" ? new Date(date) : date;
  return dateFormatter.format(normalizedDate);
}

export function formatMsToMinuteSecond(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function hijackUrl(url: string) {
  return url.replace(
    "https://api-v2.soundcloud.com",
    `${page.url.protocol}//${page.url.host}`,
  );
}
