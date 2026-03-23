import { command, form, query } from "$app/server";
import type {
  RemoteCommand,
  RemoteForm,
  RemoteFormInput,
  RemoteQueryFunction,
} from "@sveltejs/kit";
import { Effect, Schema } from "effect";

/**
 * Creates a remote query defined with `Effect`. Shares the same behavior as
 * SvelteKit's `query`.
 *
 * @param schema The `Schema` to validate arguments against.
 * @param handler The `Effect` to run when this function is ran. When `E` is `never`, then the return value will be non-nullish, otherwise the result can be `undefined`.
 * @template A success value for the given `Effect`.
 * @template E possible error for the given `Effect`.
 * @template QueryReturn `A` when `E == never`, otherwise `A | undefined`.
 * @see query
 */
export const effectfulQuery = <
  A,
  E,
  ASchema,
  ISchema,
  QueryReturn extends E extends never ? A : A | undefined,
>(
  schema: Schema.Schema<ASchema, ISchema, never>,
  handler: (args: (typeof schema)["Type"]) => Effect.Effect<A, E, never>,
): RemoteQueryFunction<ISchema, QueryReturn> =>
  query(Schema.standardSchemaV1(schema), async (args) =>
    Effect.runPromise(
      Effect.gen(function* () {
        const result = handler(args);

        if (yield* Effect.isSuccess(result)) {
          return yield* result;
        } else {
          yield* Effect.tapError(result, (error) =>
            Effect.logError(
              `An error occurred in remote query function: ${error}`,
            ),
          );

          return undefined;
        }
      }),
    ),
  ) as RemoteQueryFunction<ISchema, QueryReturn>;

/**
 * Creates a remote batch query defined with `Effect`. Shares the same
 * behavior as SvelteKit's `query.batch`.
 *
 * @param schema The `Schema` to validate arguments against.
 * @param handler The `Effect` to run when this function is ran. When `E` is `never`, then the return value will be non-nullish, otherwise the result can be `undefined`.
 * @template A success value for the given `Effect`.
 * @template E possible error for the given `Effect`.
 * @template BatchQueryReturn `A` when `E == never`, otherwise `A | undefined`.
 * @see query.batch
 */
export const effectfulBatchQuery = <
  A,
  E,
  ASchema,
  ISchema,
  BatchQueryReturn extends E extends never ? A : A | undefined,
>(
  schema: Schema.Schema<ASchema, ISchema, never>,
  handler: (
    args: (typeof schema)["Type"][],
  ) => Effect.Effect<
    (arg: (typeof schema)["Type"], idx: number) => Effect.Effect<A, E, never>
  >,
): RemoteQueryFunction<ISchema, BatchQueryReturn> =>
  query.batch(Schema.standardSchemaV1(schema), async (args) => {
    const lookup = handler(args);

    return (arg, index) =>
      Effect.runSync(
        Effect.gen(function* () {
          const fn = yield* lookup;
          const result = fn(arg, index);

          if (yield* Effect.isSuccess(result)) {
            return yield* result;
          } else {
            yield* Effect.tapError(result, (error) =>
              Effect.logError(
                `An error occurred in remote query batch function [index: ${index}, arg: ${arg}]: ${error}`,
              ),
            );

            return undefined;
          }
        }),
      );
  }) as RemoteQueryFunction<ISchema, BatchQueryReturn>;

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Creates a remote form function defined with `Effect`. Shares the same
 * behavior as SvelteKit's `form`.
 *
 * @param schema The `Schema` to validate arguments and fields against.
 * @param handler The `Effect` to run when this function is ran. When `E` is `never`, then the return value will be non-nullish, otherwise the result can be `undefined`.
 * @template A success value for the given `Effect`.
 * @template E possible error for the given `Effect`.
 * @template FormReturn `A` when `E == never`, otherwise `A | undefined`.
 * @see form
 */
export const effectfulForm = <
  A,
  E,
  ASchema extends Record<string, any>,
  ISchema extends RemoteFormInput,
  FormReturn extends E extends never ? A : A | undefined,
>(
  schema: Schema.Schema<ASchema, ISchema, never>,
  handler: (args: (typeof schema)["Type"]) => Effect.Effect<A, E, never>,
): RemoteForm<ISchema, FormReturn> =>
  form(Schema.standardSchemaV1(schema), async (args) =>
    Effect.runPromise(
      Effect.gen(function* () {
        const result = handler(args);

        if (yield* Effect.isSuccess(result)) {
          return yield* result;
        } else {
          yield* Effect.tapError(result, (error) =>
            Effect.logError(
              `An error occurred in remote form function: ${error}`,
            ),
          );

          return undefined;
        }
      }),
    ),
  ) as RemoteForm<ISchema, FormReturn>;
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Creates a remote command function defined with `Effect`. Shares the same
 * behavior as SvelteKit's `command`.
 *
 * @param schema The `Schema` to validate arguments and fields against.
 * @param handler The `Effect` to run when this function is ran. When `E` is `never`, then the return value will be non-nullish, otherwise the result can be `undefined`.
 * @template A success value for the given `Effect`.
 * @template E possible error for the given `Effect`.
 * @template CommandReturn `A` when `E == never`, otherwise `A | undefined`.
 * @see command
 */
export const effectfulCommand = <
  A,
  E,
  ASchema,
  ISchema,
  CommandReturn extends E extends never ? A : A | undefined,
>(
  schema: Schema.Schema<ASchema, ISchema, never>,
  handler: (args: (typeof schema)["Type"]) => Effect.Effect<A, E, never>,
): RemoteCommand<ISchema, CommandReturn> =>
  command(Schema.standardSchemaV1(schema), async (args) =>
    Effect.runPromise(
      Effect.gen(function* () {
        const result = handler(args);

        if (yield* Effect.isSuccess(result)) {
          return yield* result;
        } else {
          yield* Effect.tapError(result, (error) =>
            Effect.logError(
              `An error occurred in remote command function: ${error}`,
            ),
          );

          return undefined;
        }
      }),
    ),
  ) as RemoteCommand<ISchema, CommandReturn>;
