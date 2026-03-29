import { query } from "$app/server";
import { prominent } from "color.js";
import * as v from "valibot";

export const getThemeFromImageUrl = query(v.string(), async (url) => {
  const color = await prominent(url, { amount: 2, format: "hex" });
  console.log("got palette", color);
  return color;
});
