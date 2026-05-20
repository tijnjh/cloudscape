import { User } from "./user";
import * as v from "valibot";

export const Comment = v.strictObject({
  kind: v.literal("comment"),
  id: v.number(),
  body: v.string(),
  created_at: v.pipe(v.string(), v.isoTimestamp()),
  timestamp: v.number(),
  track_id: v.number(),
  user_id: v.number(),
  self: v.strictObject({
    urn: v.string(),
  }),
  user: User,
});

export type Comment = v.InferOutput<typeof Comment>;
