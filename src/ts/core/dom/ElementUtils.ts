/**
 * Checks if a value is an HTML Element of a specific type.
 *
 * This function provides a more reliable alternative to the standard `instanceof HTMLElement` check,
 * which can fail in cross-iframe environments like Elementor editor where elements might be
 * created in a different window context.
 *
 * @param subject - The value to check
 * @param typeName - The constructor name to look for in the prototype chain (defaults to 'Element')
 * @returns True if the subject is an HTML Element of the specified type, false otherwise
 *
 * @example
 * // Check if element is any HTML Element
 * if (isHTMLElement(el)) { ... }
 *
 * // Check specifically for HTMLDivElement
 * if (isHTMLElement(el, 'HTMLDivElement')) { ... }
 */
export function isHTMLElement(subject: unknown, typeName = 'Element'): subject is HTMLElement {
  if (!subject || typeof subject !== 'object') {
    return false
  }

  // Modern approach using Object.getPrototypeOf instead of the deprecated __proto__
  let proto = Object.getPrototypeOf(subject)

  // Traverse the prototype chain
  while (proto !== null) {
    // Check constructor name
    if (proto.constructor && proto.constructor.name === typeName) {
      return true
    }

    // Fallback check for node type if available (works in most DOM environments)
    if (typeName === 'Element' && subject.nodeType === 1) {
      return true
    }

    proto = Object.getPrototypeOf(proto)
  }

  return false
}
