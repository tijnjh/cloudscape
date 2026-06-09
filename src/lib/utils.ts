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

type Cases<T extends PropertyKey> = {
  [K in T]: (value: K) => unknown;
};
export function match<TValue extends PropertyKey, TCases extends Cases<TValue>>(
  value: TValue,
  cases: TCases,
): ReturnType<TCases[TValue]>;
export function match<
  TValue extends PropertyKey,
  TCases extends Partial<Cases<TValue>>,
>(
  value: TValue,
  cases: TCases & { _: (value: TValue) => unknown },
): ReturnType<NonNullable<TCases[keyof TCases]>>;
// @ts-expect-error - implicit any to allow for overloads
export function match(value, cases) {
  return (cases[value] ?? cases._)(value);
}
