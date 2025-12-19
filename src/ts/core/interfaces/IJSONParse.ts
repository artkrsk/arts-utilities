/**
 * Interface for JSON parsing utility that handles both standard and relaxed JSON formats.
 * Provides more flexible parsing than native JSON.parse() by supporting unquoted keys
 * and single quotes, which are common in configuration strings and HTML attributes.
 *
 * @example
 * ```typescript
 * // Example 1: Parse standard JSON
 * const standardJson = '{"name": "John", "age": 30}'
 * const result1 = jsonParse(standardJson)
 * // Result: { name: "John", age: 30 }
 *
 * // Example 2: Parse relaxed JSON with unquoted keys
 * const relaxedJson = '{name: "John", age: 30}'
 * const result2 = jsonParse(relaxedJson)
 * // Result: { name: "John", age: 30 }
 *
 * // Example 3: Parse JSON with single quotes
 * const singleQuoteJson = "{'name': 'John', 'age': 30}"
 * const result3 = jsonParse(singleQuoteJson)
 * // Result: { name: "John", age: 30 }
 *
 * // Example 4: Parse mixed format (common in HTML data attributes)
 * const mixedJson = '{name:"John","age":30,\'active\':true}'
 * const result4 = jsonParse(mixedJson)
 * // Result: { name: "John", age: 30, active: true }
 *
 * // Example 5: Safe parsing with fallback
 * const invalidJson = '{name:"John",age:}'
 * const result5 = jsonParse(invalidJson)
 * // Result: {} (empty object instead of throwing error)
 *
 * // Example 6: Parse HTML data attribute
 * const element = document.querySelector('[data-config]')
 * const config = jsonParse(element.dataset.config || '{}')
 * // Safely parse configuration from HTML data attribute
 * ```
 */
export interface IJSONParse {
  /**
   * Parses a JSON string with enhanced flexibility for relaxed JSON formats.
   * Attempts standard JSON.parse first, then falls back to enhanced parsing
   * that handles unquoted keys and single quotes.
   *
   * @param text - JSON string to parse (standard or relaxed format)
   * @returns Parsed object, or empty object if parsing fails
   *
   * Supported formats:
   * - Standard JSON: `{"key": "value"}`
   * - Unquoted keys: `{key: "value"}`
   * - Single quotes: `{'key': 'value'}`
   * - Mixed quotes: `{key: 'value', "other": "data"}`
   * - Numbers and booleans: `{count: 42, enabled: true}`
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (text: string): Record<string, any>
}
