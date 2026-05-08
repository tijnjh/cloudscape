import type validColors from "tailwindcss/colors";

type ValidColor = keyof typeof validColors;

export const baseColors = [
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "taupe",
  "mauve",
  "mist",
  "olive",
] as const satisfies ValidColor[];

export type BaseColor = (typeof baseColors)[number];

export const accentColors = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
] as const satisfies ValidColor[];

export type AccentColor = (typeof baseColors)[number];

export const shades = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;
