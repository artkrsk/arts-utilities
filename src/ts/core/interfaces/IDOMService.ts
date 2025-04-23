import type { TScope, TElement } from "../types";

/**
 * Interface for DOM operations service
 */
export interface IDOMService {
  /**
   * Find a single element by selector
   */
  querySelector: (scope: TScope, selector: string) => TElement | null;

  /**
   * Find multiple elements by selector
   */
  querySelectorAll: (scope: TScope, selector?: string) => TElement[];

  /**
   * Get attribute value from element
   */
  getAttribute: (element: TElement, attributeName?: string) => string | null;

  /**
   * Check if element matches a selector
   */
  matches: (element: TElement, selector?: string) => boolean;

  /**
   * Check if element contains another element
   */
  contains: (container: TElement, element: TElement) => boolean;
}
