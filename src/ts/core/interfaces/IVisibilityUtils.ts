/**
 * Options for configuring viewport visibility detection
 */
export interface IElementVisibilityOptions {
  /**
   * Whether to consider partially visible elements as visible
   * @default true
   */
  partiallyVisible?: boolean

  /**
   * Tolerance in pixels for visibility detection
   * @default 0
   */
  tolerance?: number
}

/**
 * Interface for element visibility utility functions
 */
export interface IVisibilityUtils {
  /**
   * Checks if an element is visible within the viewport
   *
   * @param element - The element to check for visibility
   * @param options - Configuration options for visibility detection
   * @returns Boolean indicating if element is visible, or undefined if element is null
   */
  elementIsVisibleInViewport: (
    element: Element | null,
    options?: IElementVisibilityOptions
  ) => boolean | undefined

  /**
   * Checks if an element is visible (not hidden by CSS)
   *
   * @param element - The element to check for visibility
   * @returns Boolean indicating if element is visible, or false if element is null
   */
  elementIsVisible: (element: Element | null) => boolean
}
