import type twColors from "tailwindcss/colors";

type Colors = Exclude<
  keyof typeof twColors,
  "inherit" | "current" | "transparent" | "black" | "white"
>;

export type BaseColor = Extract<
  Colors,
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "neutral"
  | "stone"
  | "taupe"
  | "mauve"
  | "mist"
  | "olive"
>;

export type AccentColor = Exclude<Colors, BaseColor>;

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
] as const satisfies BaseColor[];

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
] as const satisfies AccentColor[];

export const shades = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

export type ThemeMode = "light" | "dark" | "system";

export const themeModes = [
  "light",
  "dark",
  "system",
] as const satisfies ThemeMode[];
