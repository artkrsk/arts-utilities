/**
 * Interface for deep merge utility function
 */
export interface IDeepMerge {
  <T extends Record<string, any>, U extends Record<string, any>>(
    target: T,
    source: U
  ): T & U;
}

/**
 * Interface for utility that merges multiple objects
 */
export interface IDeepMergeAll {
  <T extends Record<string, any>[]>(...objects: T): Record<string, any>;
}
