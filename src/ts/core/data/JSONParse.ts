import type { IJSONParse } from '../interfaces'

/**
 * Parse options string with improved handling for relaxed JSON
 * Works with both standard JSON and relaxed syntax (unquoted keys, single quotes)
 *
 * @example
 * // Valid inputs:
 * // - {"key": "value"}
 * // - {key: "value"}
 * // - {key: 'value'}
 * // - {key: 123, another: true}
 *
 * @param strObj - String to parse
 * @returns Parsed object or empty object if parsing fails
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const JSONParse: IJSONParse = (strObj: string): Record<string, any> => {
  if (!strObj || typeof strObj !== 'string') {
    return {}
  }

  try {
    // First try standard JSON parsing
    return JSON.parse(strObj)
  } catch (error) {
    // If that fails, try with enhanced parsing
    try {
      return JSON.parse(convertToStandardJSON(strObj))
    } catch (innerError) {
      // Silently fail and return empty object
      return {}
    }
  }
}

/**
 * Convert relaxed JSON string to valid JSON
 * @param strObj - Relaxed JSON string
 * @returns Valid JSON string
 */
export function convertToStandardJSON(strObj: string): string {
  if (!strObj) {
    return '{}'
  }

  // Replace single quotes with double quotes (but not inside already quoted strings)
  let filteredStr = strObj

  // Handle quotes: replace single quotes with double quotes
  filteredStr = filteredStr.replace(/'/g, '"')

  // Fix property names without quotes
  filteredStr = filteredStr.replace(/(?<=\{|,)(\s*)([a-zA-Z0-9_$]+)(\s*):/g, '$1"$2"$3:')

  // Handle missing commas between properties
  filteredStr = filteredStr
    .replace(/}"/g, '},"')
    .replace(/]"/g, '],"')
    .replace(/}'/g, '},')
    .replace(/]'/g, '],')

  return filteredStr
}
