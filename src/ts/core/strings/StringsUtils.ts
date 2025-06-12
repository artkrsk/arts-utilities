/**
 * Sanitizes a CSS selector string by removing unnecessary whitespace and line breaks.
 *
 * @param selector - The CSS selector string to sanitize.
 * @returns The sanitized selector string.
 *
 * @example
 * ```typescript
 * // Example 1: Messy selector with linebreaks and inconsistent spacing
 * const messySelector = `
 *   .header > nav,
 *   .main-container .content,
 *     #sidebar
 * `;
 *
 * // Get a clean, normalized selector string
 * const cleanSelector = Utilities.sanitizeSelector(messySelector);
 * // Result: ".header > nav,.main-container .content,#sidebar"
 *
 * // Example 2: Use the sanitized selector to query elements safely
 * const elements = document.querySelectorAll(cleanSelector);
 *
 * // Invalid selectors return empty string to prevent DOM errors
 * const invalidSelector = Utilities.sanitizeSelector("div[attr='unclosed");
 * // Result: ""
 *
 * // Example 3: Useful for handling user-provided selectors or template strings
 * function selectDynamicContent(area, type) {
 *   const selector = Utilities.sanitizeSelector(`#${area} .${type}-content`);
 *   return selector ? document.querySelectorAll(selector) : [];
 * }
 * // Example usage: selectDynamicContent("main", "featured");
 * // Result: NodeList of elements matching "#main .featured-content"
 * ```
 */
export const sanitizeSelector = (selector: string, verbose = false): string => {
  if (typeof selector !== 'string' || selector.trim() === '') {
    if (verbose) {
      console.warn('sanitizeSelector: selector must be a non-empty string')
    }
    return ''
  }

  // First normalize the selector
  const normalizedSelector = selector
    .replace(/(\r\n|\n|\r|\t)/gm, ' ') // Replace line breaks and tabs with spaces
    .replace(/\s+/g, ' ') // Normalize multiple spaces to single spaces
    .replace(/^[,\s]+|[,\s]+$/g, '') // Remove leading/trailing whitespace and commas
    .replace(/\s*,\s*/g, ',') // Normalize spaces around commas

  try {
    // Test if it's a valid selector by trying to use it
    document.querySelector(normalizedSelector)

    // If we get here, the selector is valid
    return normalizedSelector
  } catch (e) {
    if (verbose) {
      console.warn('sanitizeSelector: Invalid selector', e)
    }
    return ''
  }
}

/**
 * Normalizes a URL by resolving it against the current origin
 * and removing any trailing slashes or unnecessary parts.
 *
 * @param url - URL to normalize
 * @returns Normalized URL string
 *
 * @example
 * ```typescript
 * // Example 1: Normalize a relative URL
 * const relativeURL = '/about/';
 * const normalizedRelativeURL = Utilities.normalizeURL(relativeURL);
 * // Result: "https://example.com/about"
 *
 * // Example 2: Normalize an absolute URL
 * const absoluteURL = 'https://example.com/contact/';
 * const normalizedAbsoluteURL = Utilities.normalizeURL(absoluteURL);
 * // Result: "https://example.com/contact"
 *
 * // Example 3: Normalize a URL with query parameters
 * const queryURL = 'https://example.com/search?q=term';
 * const normalizedQueryURL = Utilities.normalizeURL(queryURL);
 * // Result: "https://example.com/search?q=term"
 *
 * // Example 4: Normalize a URL with a hash fragment
 * const hashURL = 'https://example.com/page#section';
 * const normalizedHashURL = Utilities.normalizeURL(hashURL);
 * // Result: "https://example.com/page#section"
 * ```
 */
export const normalizeURL = (url: string): string => {
  // Handle absolute and relative URLs
  const fullUrl = new URL(url, window.location.origin)

  // Normalize the URL
  let normalized = fullUrl.href

  // Remove trailing slash for consistency (except for root URLs)
  if (normalized.endsWith('/') && normalized !== `${fullUrl.origin}/`) {
    normalized = normalized.slice(0, -1)
  }

  return normalized
}

/**
 * Parses a string of class names and returns an array of clean class names.
 * Handles space-separated class names, removes leading dots, and trims whitespace.
 *
 * @param classInput - The string containing class names to parse (defaults to empty string).
 * @returns An array of clean class names without leading dots.
 *
 * @example
 * ```typescript
 * // Example 1: Parse basic space-separated class names
 * const basicClasses = Utilities.parseClassNames('header nav active');
 * // Result: ['header', 'nav', 'active']
 *
 * // Example 2: Parse class names with leading dots (CSS selector format)
 * const selectorClasses = Utilities.parseClassNames('.btn .btn-primary .disabled');
 * // Result: ['btn', 'btn-primary', 'disabled']
 *
 * // Example 3: Parse mixed format with extra whitespace
 * const messyClasses = Utilities.parseClassNames('  .container   main-content   .active  ');
 * // Result: ['container', 'main-content', 'active']
 * ```
 */
export const parseClassNames = (classInput: string = ''): string[] => {
  if (typeof classInput !== 'string' || classInput.trim().length === 0) {
    return []
  }

  // Handle space-separated class names
  const classes = classInput.split(' ').filter(Boolean)

  // Process each class name (remove leading dots, trim whitespace)
  return classes.map((className) => {
    className = className.trim()
    return className.startsWith('.') ? className.substring(1) : className
  })
}

/**
 * Parses a color string (rgb/rgba/hex format) and extracts the color and alpha values.
 * Returns the color as an rgb string and the alpha as a separate value.
 *
 * @param colorString - The color string to parse (rgb, rgba, or hex format)
 * @returns Object containing the color (rgb string) and alpha value, or null if parsing fails
 *
 * @example
 * ```typescript
 * // Example 1: Parse RGB color
 * const rgbResult = parseColorString('rgb(255, 128, 0)');
 * // Result: { color: 'rgb(255, 128, 0)', alpha: 1.0 }
 *
 * // Example 2: Parse RGBA color with alpha
 * const rgbaResult = parseColorString('rgba(255, 128, 0, 0.5)');
 * // Result: { color: 'rgb(255, 128, 0)', alpha: 0.5 }
 *
 * // Example 3: Parse RGBA with spaces
 * const spacedResult = parseColorString('rgba( 255 , 128 , 0 , 0.75 )');
 * // Result: { color: 'rgb(255, 128, 0)', alpha: 0.75 }
 *
 * // Example 4: Parse HEX color (3-digit)
 * const hexResult3 = parseColorString('#f80');
 * // Result: { color: 'rgb(255, 136, 0)', alpha: 1.0 }
 *
 * // Example 5: Parse HEX color (6-digit)
 * const hexResult6 = parseColorString('#ff8800');
 * // Result: { color: 'rgb(255, 136, 0)', alpha: 1.0 }
 *
 * // Example 6: Parse HEX color (8-digit with alpha)
 * const hexResult8 = parseColorString('#ff880080');
 * // Result: { color: 'rgb(255, 136, 0)', alpha: 0.5 }
 *
 * // Example 7: Invalid color string
 * const invalidResult = parseColorString('hsl(120, 100%, 50%)');
 * // Result: null
 *
 * // Example 8: Use in conditional logic
 * const parsed = parseColorString(userColorInput);
 * if (parsed) {
 *   element.style.backgroundColor = parsed.color;
 *   element.style.opacity = parsed.alpha.toString();
 * }
 * ```
 */
export const parseColorString = (colorString: string): { color: string; alpha: number } | null => {
  if (typeof colorString !== 'string' || colorString.trim() === '') {
    return null
  }

  // Separate regex for rgb and rgba to enforce proper format
  const rgbRegex = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/
  const rgbaRegex = /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d*\.?\d*)\s*\)$/
  const hexRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/

  // Try RGB format
  let match = colorString.match(rgbRegex)
  if (match) {
    const [, r, g, b] = match
    const color = `rgb(${r}, ${g}, ${b})`
    return { color, alpha: 1.0 }
  }

  // Try RGBA format
  match = colorString.match(rgbaRegex)
  if (match) {
    const [, r, g, b, a] = match
    const color = `rgb(${r}, ${g}, ${b})`
    const alpha = a ? parseFloat(a) : 0
    return { color, alpha }
  }

  // Try HEX format
  match = colorString.match(hexRegex)
  if (match && match[1]) {
    const hex = match[1]
    let r = 0
    let g = 0
    let b = 0
    let alpha = 1.0

    if (hex.length === 3) {
      // 3-digit hex: #rgb -> #rrggbb
      r = parseInt(hex.charAt(0) + hex.charAt(0), 16)
      g = parseInt(hex.charAt(1) + hex.charAt(1), 16)
      b = parseInt(hex.charAt(2) + hex.charAt(2), 16)
    } else if (hex.length === 6) {
      // 6-digit hex: #rrggbb
      r = parseInt(hex.substring(0, 2), 16)
      g = parseInt(hex.substring(2, 4), 16)
      b = parseInt(hex.substring(4, 6), 16)
    } else {
      // 8-digit hex: #rrggbbaa
      r = parseInt(hex.substring(0, 2), 16)
      g = parseInt(hex.substring(2, 4), 16)
      b = parseInt(hex.substring(4, 6), 16)
      alpha = parseInt(hex.substring(6, 8), 16) / 255
    }

    const color = `rgb(${r}, ${g}, ${b})`
    return { color, alpha }
  }

  return null
}
