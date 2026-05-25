type HasDuplicates<T extends readonly unknown[]> = T extends [
  infer F,
  ...infer R,
] ? F extends R[number] ? true
  : HasDuplicates<R>
  : false;

export type Unique<T extends readonly unknown[]> = HasDuplicates<T> extends true
  ? never
  : T;
