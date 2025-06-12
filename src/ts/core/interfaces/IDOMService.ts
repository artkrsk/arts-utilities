import type { TScope, TElement } from '../types'

/**
 * Interface for DOM operations service
 */
export interface IDOMService {
  /**
   * Find a single element by selector
   */
  querySelector: (scope: TScope, selector: string) => TElement | null

  /**
   * Find multiple elements by selector
   */
  querySelectorAll: (scope: TScope, selector?: string) => TElement[]

  /**
   * Get attribute value from element
   */
  getAttribute: (element: TElement, attributeName?: string) => string | null

  /**
   * Check if element matches a selector
   */
  matches: (element: TElement, selector?: string) => boolean

  /**
   * Check if element contains another element
   */
  contains: (container: TElement, element: TElement) => boolean

  /**
   * Gets the document element
   */
  getDocumentElement: () => HTMLElement

  /**
   * Gets the body element
   */
  getBodyElement: () => HTMLElement

  /**
   * Add class to element
   */
  addClass: (element: TElement, className: string) => void

  /**
   * Remove class from element
   */
  removeClass: (element: TElement, className: string) => void

  /**
   * Toggle class on element
   */
  toggleClass: (element: TElement, className: string, force?: boolean) => boolean

  /**
   * Toggle multiple classes on element
   */
  toggleClasses: (element: TElement, classNames: string, force?: boolean) => boolean[]

  /**
   * Find the closest ancestor of the element that matches the selector.
   */
  closest: (element: TElement, selector: string) => TElement | null
}
