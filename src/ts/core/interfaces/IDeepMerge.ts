/**
 * Recursively merges `source` into `target`, returning a new object.
 *
 * Behavior at each key:
 * - Both values are plain objects → merged recursively
 * - Both values are arrays → concatenated (target items first)
 * - Otherwise → `source` value wins when defined
 */
export interface IDeepMerge {
	<T extends Record<string, unknown>, U extends Record<string, unknown>>(
		target: T,
		source: U,
	): T & U;
}

/**
 * Folds {@link IDeepMerge} across multiple objects left-to-right.
 * Each subsequent object is merged into the accumulated result.
 */
export interface IDeepMergeAll {
	<T extends Record<string, unknown>[]>(...objects: T): Record<string, unknown>;
}
