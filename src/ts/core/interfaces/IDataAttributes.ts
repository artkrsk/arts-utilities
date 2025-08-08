/**
 * Interface for data attribute parsing utility that extracts and converts HTML data-* attributes
 * to nested object structures. Provides flexible parsing options including custom separators
 * and pattern filtering for selective attribute processing.
 *
 * @example
 * ```typescript
 * // Example 1: Parse all data attributes with default settings
 * const element = document.querySelector('[data-speed="2"][data-effect-type="parallax"]')
 * const data = parseDataAttributes(element)
 * // Result: { speed: "2", effect: { type: "parallax" } }
 *
 * // Example 2: Parse with custom separator
 * const element = document.querySelector('[data-api__timeout="5000"][data-api__retries="3"]')
 * const data = parseDataAttributes(element, { separator: '__' })
 * // Result: { api: { timeout: "5000", retries: "3" } }
 *
 * // Example 3: Parse with pattern filtering
 * const element = document.querySelector('[data-parallax-speed="2"][data-other-value="test"]')
 * const data = parseDataAttributes(element, { pattern: /parallax/ })
 * // Result: { parallax: { speed: "2" } }
 *
 * // Example 4: Complex nested structure
 * const element = document.querySelector('[data-config-api-timeout="5000"][data-config-ui-theme="dark"]')
 * const data = parseDataAttributes(element, { separator: '-' })
 * // Result: { config: { api: { timeout: "5000" }, ui: { theme: "dark" } } }
 *
 * // Example 5: Multiple separators and filtering
 * const element = document.querySelector('[data-widget__settings__animation="fade"]')
 * const data = parseDataAttributes(element, {
 *   separator: '__',
 *   pattern: /widget/
 * })
 * // Result: { widget: { settings: { animation: "fade" } } }
 * ```
 */
export interface IDataAttributeOptions {
  /**
   * Character or string used to split attribute names into nested object paths.
   * Default: '-'
   *
   * @example
   * // Using default separator '-'
   * // data-config-api-timeout → { config: { api: { timeout: value } } }
   *
   * // Using custom separator '__'
   * // data-config__api__timeout → { config: { api: { timeout: value } } }
   */
  separator?: string

  /**
   * Regular expression pattern to filter which data attributes to process.
   * Only attributes whose names (after removing 'data-' prefix) match this pattern will be included.
   * Default: /^/ (matches all data attributes)
   *
   * @example
   * // Only process parallax-related attributes
   * pattern: /parallax/
   *
   * // Only process attributes starting with 'config'
   * pattern: /^config/
   *
   * // Only process widget or animation attributes
   * pattern: /(widget|animation)/
   */
  pattern?: RegExp
}

/**
 * Represents an HTML attribute with name and value properties.
 * Used internally for processing individual data attributes.
 */
export interface IDataAttribute {
  /** The full attribute name (e.g., 'data-config-timeout') */
  name: string
  /** The attribute value as a string */
  value: string
}

/**
 * Function signature for parsing HTML data attributes into nested object structures.
 * Converts data-* attributes on an element to a hierarchical object based on attribute names.
 *
 * @param element - The HTML element to extract data attributes from
 * @param options - Configuration options for parsing behavior
 * @returns Object with nested structure reflecting the data attribute hierarchy
 */
export interface IParseDataAttributes {
  (element: HTMLElement, options?: IDataAttributeOptions): Record<string, any>
}

/**
 * Function signature for parsing individual data attributes.
 * Used internally to process each attribute and build the nested structure.
 *
 * @param attr - The HTML attribute to parse
 * @param result - The target object to build the nested structure in
 * @param separator - Character used to split attribute name into nested path
 */
export interface IParseAttribute {
  (attr: IDataAttribute, result: Record<string, any>, separator: string): void
}

/**
 * Function signature for filtering data attributes based on pattern matching.
 * Determines whether an attribute should be included in the parsing process.
 *
 * @param attr - The HTML attribute to check
 * @param pattern - RegExp pattern to test against attribute name
 * @returns True if attribute should be processed, false otherwise
 */
export interface IFilterDataAttributes {
  (attr: IDataAttribute, pattern: RegExp): boolean
}
