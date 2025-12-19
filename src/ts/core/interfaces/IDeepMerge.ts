/**
 * Interface for deep merge utility function that recursively merges two objects.
 * Unlike Object.assign() or spread operator, deep merge handles nested objects properly.
 *
 * @example
 * ```typescript
 * // Example 1: Configuration merging
 * const defaultConfig = {
 *   api: {
 *     baseUrl: 'https://api.example.com',
 *     timeout: 5000,
 *     retries: 3
 *   },
 *   ui: {
 *     theme: 'light',
 *     animations: true
 *   }
 * }
 *
 * const userConfig = {
 *   api: {
 *     timeout: 10000 // Override timeout but keep other api settings
 *   },
 *   ui: {
 *     theme: 'dark' // Override theme but keep animations
 *   }
 * }
 *
 * const mergedConfig = deepMerge(defaultConfig, userConfig)
 * // Result: {
 * //   api: { baseUrl: '...', timeout: 10000, retries: 3 },
 * //   ui: { theme: 'dark', animations: true }
 * // }
 *
 * // Example 2: Component props merging
 * const defaultProps = {
 *   style: { color: 'black', fontSize: '14px' },
 *   className: 'default-component',
 *   options: { enabled: true, mode: 'auto' }
 * }
 *
 * const customProps = {
 *   style: { color: 'blue' }, // Only override color
 *   options: { mode: 'manual' } // Only override mode
 * }
 *
 * const finalProps = deepMerge(defaultProps, customProps)
 * // Result: {
 * //   style: { color: 'blue', fontSize: '14px' },
 * //   className: 'default-component',
 * //   options: { enabled: true, mode: 'manual' }
 * // }
 * ```
 */
export interface IDeepMerge {
  /**
   * Recursively merges two objects, with source properties overriding target properties.
   * Creates a new object without modifying the original objects.
   *
   * @param target - The target object to merge into
   * @param source - The source object to merge from
   * @returns New object with merged properties from both target and source
   */
  <T extends Record<string, unknown>, U extends Record<string, unknown>>(target: T, source: U): T & U
}

/**
 * Interface for utility that merges multiple objects in sequence.
 * Each subsequent object's properties override previous ones at all nesting levels.
 *
 * @example
 * ```typescript
 * // Example: Multi-layer configuration
 * const baseConfig = {
 *   database: { host: 'localhost', port: 5432 },
 *   cache: { ttl: 3600, enabled: true }
 * }
 *
 * const envConfig = {
 *   database: { host: 'prod-db.example.com' },
 *   cache: { ttl: 7200 }
 * }
 *
 * const userConfig = {
 *   cache: { enabled: false }
 * }
 *
 * const finalConfig = deepMergeAll(baseConfig, envConfig, userConfig)
 * // Result: {
 * //   database: { host: 'prod-db.example.com', port: 5432 },
 * //   cache: { ttl: 7200, enabled: false }
 * // }
 *
 * // Example: Theme system with multiple layers
 * const baseTheme = {
 *   colors: { primary: '#007bff', secondary: '#6c757d' },
 *   typography: { fontSize: '14px', lineHeight: 1.5 }
 * }
 *
 * const brandTheme = {
 *   colors: { primary: '#custom-brand' }
 * }
 *
 * const userTheme = {
 *   typography: { fontSize: '16px' }
 * }
 *
 * const compiledTheme = deepMergeAll(baseTheme, brandTheme, userTheme)
 * ```
 */
export interface IDeepMergeAll {
  /**
   * Merges multiple objects recursively in the order provided.
   * Later objects override properties from earlier objects at all nesting levels.
   *
   * @param objects - Variable number of objects to merge
   * @returns New object with all properties merged
   */
  <T extends Record<string, unknown>[]>(...objects: T): Record<string, unknown>
}
