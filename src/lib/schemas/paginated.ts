import { Schema } from "effect";

export const Paginated = Schema.Struct({
  limit: Schema.UndefinedOr(Schema.Number),
  offset: Schema.UndefinedOr(Schema.Number),
});

export type Paginated = typeof Paginated.Type;
