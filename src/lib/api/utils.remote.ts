import { query } from "$app/server";
import * as v from "valibot";

export const $fetch = query(
  v.object({
    input: v.union([v.string(), v.instance(Request), v.instance(URL)]),
    init: v.optional(v.object({}) as v.GenericSchema<RequestInit>),
    output: v.optional(v.picklist(["json", "text"]), "json"),
  }),
  async ({ input, init, output }) =>
    await fetch(input, init).then((r) => r[output]()),
);
