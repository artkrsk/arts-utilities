import type {
  IDataAttribute,
  IDataAttributeOptions,
  IFilterDataAttributes,
  IParseAttribute,
  IParseDataAttributes
} from '../interfaces'

/**
 * Parses a single data attribute and builds nested object structure.
 * Splits attribute name by separator and creates nested objects based on the path.
 *
 * @param attr - The HTML attribute to parse
 * @param result - The target object to build the nested structure in
 * @param separator - Character used to split attribute name into nested path
 */
export const parseAttribute: IParseAttribute = (
  attr: IDataAttribute,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: Record<string, any>,
  separator: string
): void => {
  // Remove 'data-' prefix and split by separator
  const path = attr.name.slice(5).split(separator)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  path.reduce((obj: Record<string, any>, part: string, idx: number, fullPath: string[]) => {
    // Skip the 'data' part if it somehow remains
    if (part === 'data') {
      return obj
    }

    // End of path reached, store the value
    if (idx === fullPath.length - 1) {
      obj[part] = attr.value
    } else {
      // Inside the path, create nested object if it doesn't exist
      obj[part] = obj[part] && typeof obj[part] === 'object' ? obj[part] : {}
    }

    // Return reference to current part for next iteration
    return obj[part]
  }, result)
}

/**
 * Filters HTML attributes to find data attributes matching a specified pattern.
 * Tests both that the attribute is a data attribute and that it matches the provided pattern.
 *
 * @param attr - The HTML attribute to check
 * @param pattern - RegExp pattern to test against attribute name (after removing 'data-' prefix)
 * @returns True if attribute is a data attribute and matches the pattern
 */
export const filterDataAttributes: IFilterDataAttributes = (
  attr: IDataAttribute,
  pattern: RegExp
): boolean => {
  const isDataAttribute = /^data-/.test(attr.name)

  if (!pattern) {
    return isDataAttribute
  }

  // Test the pattern against the attribute name without the 'data-' prefix
  return isDataAttribute && pattern.test(attr.name.slice(5))
}

/**
 * Converts HTML data attributes to a nested object structure.
 * Processes all data-* attributes on an element and creates a hierarchical object
 * based on the attribute names, using a separator to define nesting levels.
 *
 * @param element - The HTML element to extract data attributes from
 * @param options - Configuration options for parsing behavior
 * @param options.separator - Character used to split attribute names (default: '-')
 * @param options.pattern - RegExp to filter which data attributes to include (default: /^/ - all)
 * @returns Object with nested structure based on data attribute names
 */
export const parseDataAttributes: IParseDataAttributes = (
  element: HTMLElement,
  options: IDataAttributeOptions = {}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: Record<string, any> = {}

  // Set default options
  const separator = options.separator ?? '-'
  const pattern = options.pattern ?? /^/

  // Convert HTMLCollection to array and process each attribute
  Array.prototype.slice
    .call(element.attributes)
    .filter((attr: IDataAttribute) => filterDataAttributes(attr, pattern))
    .forEach((attr: IDataAttribute) => parseAttribute(attr, result, separator))

  return result
}
