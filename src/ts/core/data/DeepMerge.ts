import type { IDeepMerge, IDeepMergeAll } from '../interfaces'

/**
 * Performs deep merging of two objects, recursively combining nested properties.
 * Arrays are concatenated, objects are merged, and primitive values are overridden.
 *
 * @param target - The target object to merge into (serves as the base)
 * @param source - The source object to merge from (values override target)
 * @returns A new object with merged properties from both target and source
 *
 * @example
 * ```typescript
 * // Example 1: Basic object merging
 * const target = { a: 1, b: { x: 10 } };
 * const source = { b: { y: 20 }, c: 3 };
 * const result = deepmerge(target, source);
 * // Result: { a: 1, b: { x: 10, y: 20 }, c: 3 }
 *
 * // Example 2: Array concatenation
 * const target = { items: [1, 2] };
 * const source = { items: [3, 4] };
 * const result = deepmerge(target, source);
 * // Result: { items: [1, 2, 3, 4] }
 *
 * // Example 3: Configuration merging
 * const defaultConfig = {
 *   api: { timeout: 5000, retries: 3 },
 *   features: ['basic']
 * };
 * const userConfig = {
 *   api: { timeout: 10000 },
 *   features: ['advanced'],
 *   debug: true
 * };
 * const finalConfig = deepmerge(defaultConfig, userConfig);
 * // Result: {
 * //   api: { timeout: 10000, retries: 3 },
 * //   features: ['basic', 'advanced'],
 * //   debug: true
 * // }
 * ```
 */
export const deepmerge: IDeepMerge = <T extends Record<string, unknown>, U extends Record<string, unknown>>(
  target: T,
  source: U
): T & U => {
  const output = { ...target } as T & U

  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return output
  }

  Object.keys(source).forEach((key) => {
    const targetValue = target[key as keyof T]
    const sourceValue = source[key as keyof U]

    if (
      targetValue &&
      sourceValue &&
      typeof targetValue === 'object' &&
      typeof sourceValue === 'object' &&
      !Array.isArray(targetValue) &&
      !Array.isArray(sourceValue)
    ) {
      // If both values are objects, merge them recursively
      output[key as keyof (T & U)] = deepmerge(targetValue, sourceValue)
    } else if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      // If both are arrays, concatenate them
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      output[key as keyof (T & U)] = [...targetValue, ...sourceValue] as any
    } else if (sourceValue !== undefined) {
      // Otherwise just take the source value
      output[key as keyof (T & U)] = sourceValue
    }
  })

  return output
}

/**
 * Performs deep merging of multiple objects in sequence, from left to right.
 * Each subsequent object overrides properties from previous objects.
 *
 * @param objects - Variable number of objects to merge together
 * @returns A new object containing all merged properties
 *
 * @example
 * ```typescript
 * // Example 1: Multiple configuration layers
 * const base = { theme: 'light', timeout: 1000 };
 * const environment = { timeout: 5000, debug: false };
 * const user = { theme: 'dark' };
 * const final = deepmergeAll(base, environment, user);
 * // Result: { theme: 'dark', timeout: 5000, debug: false }
 *
 * // Example 2: Plugin configuration system
 * const coreDefaults = {
 *   features: ['core'],
 *   settings: { enabled: true, level: 1 }
 * };
 * const pluginA = {
 *   features: ['pluginA'],
 *   settings: { level: 2 }
 * };
 * const pluginB = {
 *   features: ['pluginB'],
 *   settings: { advanced: true }
 * };
 * const combined = deepmergeAll(coreDefaults, pluginA, pluginB);
 * // Result: {
 * //   features: ['core', 'pluginA', 'pluginB'],
 * //   settings: { enabled: true, level: 2, advanced: true }
 * // }
 *
 * // Example 3: Theme inheritance
 * const baseTheme = { colors: { primary: '#000' } };
 * const seasonalTheme = { colors: { secondary: '#fff' } };
 * const customTheme = { colors: { accent: '#f00' } };
 * const finalTheme = deepmergeAll(baseTheme, seasonalTheme, customTheme);
 * // Result: { colors: { primary: '#000', secondary: '#fff', accent: '#f00' } }
 * ```
 */
export const deepmergeAll: IDeepMergeAll = <T extends Record<string, unknown>[]>(
  ...objects: T
): Record<string, unknown> => {
  return objects.reduce((result, current) => {
    return deepmerge(result, current)
  }, {})
}
