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

export function formatDate(date?: Date | string | null | undefined) {
  if (!date) return;
  const normalizedDate = typeof date === "string" ? new Date(date) : date;
  return dateFormatter.format(normalizedDate);
}

export function match<
  TValue extends PropertyKey,
  TCases extends Record<TValue, () => unknown>,
>(value: TValue, cases: TCases): ReturnType<TCases[TValue]>;
export function match<
  TValue extends PropertyKey,
  TCases extends Partial<Record<TValue, () => unknown>>,
>(
  value: TValue,
  cases: TCases & { _: () => unknown },
): ReturnType<NonNullable<TCases[keyof TCases]>>;
// @ts-expect-error - implicit any to allow for overloads
export function match(value, cases) {
  return (cases[value] ?? cases._)();
}
