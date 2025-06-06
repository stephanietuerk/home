// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ToArray<T> = T extends any[] ? T : T[];

// https://stackoverflow.com/questions/49242232/constraining-type-in-typescript-generic-to-be-one-of-several-types
export type OneOf<
  T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  V extends any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  NK extends keyof V = Exclude<keyof V, keyof any[]>,
> = { [K in NK]: T extends V[K] ? V[K] : never }[NK];
