/**
 * pattern-matching helper for typescript
 * source: https://gist.github.com/tijnjh/e8b3c575f9813988577c3382d21558f7
 */

// -- helpers --

type Narrowable =
  | string
  | number
  | bigint
  | boolean
  | symbol
  | object
  | null
  | undefined;
type Cases<TValue extends PropertyKey, TReturn> = {
  [K in TValue]: () => TReturn;
};
type DefaultCases<T extends PropertyKey, R> = Partial<Cases<T, R>> & {
  _: () => R;
};
type NoExtraKeys<TKeys, TAllowed extends PropertyKey> = Record<
  Exclude<keyof TKeys, TAllowed>,
  never
>;

// -- implementation --

/**
 * matches a value against a set of handlers
 *
 * cases are keyed by the possible values of `value`. when all cases are provided, the match is exhaustive
 *
 * when using `_`, unmatched values are handled by the fallback
 *
 * extra keys that are not possible values are rejected
 *
 * @param value the value to match
 * @param cases case handlers, optionally with a `_` fallback
 * @returns the result of the matched handler
 *
 * @example
 * ```ts
 * const label = match(status, {
 *   idle: () => 'waiting...',
 *   loading: () => 'loading...',
 *   error: () => 'failed',
 * })
 * ```
 *
 * @example
 * ```ts
 * const result = match(value, {
 *   yes: () => true,
 *   _: () => false,
 * })
 * ```
 */
function match<const TValue extends PropertyKey, TReturn extends Narrowable>(
  value: TValue,
  cases: Cases<TValue, TReturn>,
): TReturn;

function match<
  const TValue extends PropertyKey,
  TCases extends Cases<TValue, unknown> & NoExtraKeys<TCases, TValue>,
>(value: TValue, cases: TCases): ReturnType<TCases[TValue]>;

function match<const TValue extends PropertyKey, TReturn extends Narrowable>(
  value: TValue,
  cases: DefaultCases<TValue, TReturn>,
): TReturn;

function match<
  const TValue extends PropertyKey,
  TCases extends DefaultCases<TValue, unknown> &
    NoExtraKeys<TCases, TValue | "_">,
>(
  value: TValue,
  cases: TCases,
): ReturnType<Extract<TCases[keyof TCases], () => unknown>>;

// @ts-expect-error - implicit any to allow overload implementation
function match(value, cases) {
  return (cases[value] ?? cases._)();
}

export { match };
