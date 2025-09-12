import type { TScope, TElement } from '../types'
import type { IDOMService } from '../interfaces'
import { parseClassNames } from '../strings/StringsUtils'

/**
 * Service for DOM operations, makes testing easier by allowing mocking
 */
class DOMServiceClass {
  /**
   * Find a single element by selector.
   *
   * @returns Element or null if not found (matches native DOM behavior)
   */
  public static querySelector(scope: TScope, selector: string): TElement | null {
    if (!selector) {
      return null
    }

    if (!(scope instanceof Element || scope instanceof Document)) {
      return null
    }
    try {
      return scope.querySelector(selector) as TElement | null
    } catch (_error) {
      return null
    }
  }

  /**
   * Find multiple elements by selector.
   *
   * @param scope Element or document to search in
   * @param selector CSS selector
   */
  public static querySelectorAll(scope: TScope, selector?: string): TElement[] {
    if (!selector) {
      return []
    }

    try {
      return Array.from(scope.querySelectorAll(selector)) as TElement[]
    } catch (_error) {
      return []
    }
  }

  /**
   * Get attribute value from element.
   *
   * @param element Element to get attribute from
   * @param attributeName Attribute name
   */
  public static getAttribute(element: Element, attributeName?: string): string | null {
    if (!attributeName) {
      return null
    }

    try {
      return element.getAttribute(attributeName)
    } catch (_error) {
      return null
    }
  }

  /**
   * Check if element has a specified attribute.
   *
   * @param element Element to check
   * @param attributeName Attribute name to check for
   */
  public static hasAttribute(element: Element, attributeName?: string): boolean {
    if (!attributeName) {
      return false
    }

    try {
      return element.hasAttribute(attributeName)
    } catch (_error) {
      return false
    }
  }

  /**
   * Check if element matches a selector.
   *
   * @param element Element to check
   * @param selector CSS selector
   */
  public static matches(element: TElement, selector?: string): boolean {
    if (!selector) {
      return false
    }

    try {
      return element.matches(selector)
    } catch (_error) {
      return false
    }
  }

  /**
   * Check if element contains another element.
   *
   * @param container Container element
   * @param element Element to check for
   */
  public static contains(container: TElement, element: Element): boolean {
    if (!container || !element) {
      return false
    }

    try {
      return container.contains(element)
    } catch (_error) {
      return false
    }
  }

  /**
   * Gets the document object
   *
   * @returns The global document object
   */
  public static getDocument(): Document {
    return document
  }

  /**
   * Gets the document element
   *
   * @returns The HTML document element
   */
  public static getDocumentElement(): HTMLElement {
    return document.documentElement
  }

  public static getBodyElement(): HTMLElement {
    return document.body
  }

  /**
   * Add class to element
   *
   * @param element Element to add class to
   * @param className Class name to add
   */
  public static addClass(element: TElement, className: string): void {
    if (!element || !className) {
      return
    }

    try {
      element.classList.add(className)
    } catch (_error) {
      // Handle error silently
    }
  }

  /**
   * Remove class from element
   *
   * @param element Element to remove class from
   * @param className Class name to remove
   */
  public static removeClass(element: TElement, className: string): void {
    if (!element || !className) {
      return
    }

    try {
      element.classList.remove(className)
    } catch (_error) {
      // Handle error silently
    }
  }

  /**
   * Toggle class on element
   *
   * @param element Element to toggle class on
   * @param className Class name to toggle
   * @param force Optional boolean that forces class to be added or removed
   * @returns True if class is present after toggle, false otherwise
   */
  public static toggleClass(element: TElement, className: string, force?: boolean): boolean {
    if (!element || !className) {
      return false
    }

    try {
      return element.classList.toggle(className, force)
    } catch (_error) {
      return false
    }
  }

  /**
   * Toggle multiple classes on element
   *
   * @param element Element to toggle classes on
   * @param classNames Space-separated class names to toggle (supports CSS selector format with dots)
   * @param force Optional boolean that forces all classes to be added or removed
   * @returns Array of booleans indicating if each class is present after toggle
   */
  public static toggleClasses(element: TElement, classNames: string, force?: boolean): boolean[] {
    if (!element || !classNames) {
      return []
    }

    const classes = parseClassNames(classNames)
    const results: boolean[] = []

    for (const className of classes) {
      try {
        const result = element.classList.toggle(className, force)
        results.push(result)
      } catch (_error) {
        results.push(false)
      }
    }

    return results
  }

  /**
   * Find the closest ancestor of the element that matches the selector.
   *
   * @param element Element to start the search from
   * @param selector CSS selector to match
   * @returns Closest ancestor element or null if not found
   */
  public static closest(element: TElement, selector: string): TElement | null {
    if (!element || !selector) {
      return null
    }

    try {
      return element.closest(selector) as TElement | null
    } catch (_error) {
      return null
    }
  }
}

export const DOMService: IDOMService = {
  querySelector: DOMServiceClass.querySelector,
  querySelectorAll: DOMServiceClass.querySelectorAll,
  getAttribute: DOMServiceClass.getAttribute,
  hasAttribute: DOMServiceClass.hasAttribute,
  matches: DOMServiceClass.matches,
  contains: DOMServiceClass.contains,
  getDocument: DOMServiceClass.getDocument,
  getDocumentElement: DOMServiceClass.getDocumentElement,
  getBodyElement: DOMServiceClass.getBodyElement,
  addClass: DOMServiceClass.addClass,
  removeClass: DOMServiceClass.removeClass,
  toggleClass: DOMServiceClass.toggleClass,
  toggleClasses: DOMServiceClass.toggleClasses,
  closest: DOMServiceClass.closest
}
