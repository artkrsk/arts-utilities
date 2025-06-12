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
 * Options for configuring fullscreen rectangle detection
 */
export interface IFullscreenRectOptions {
  /**
   * Whether to round dimensions and position values before comparison
   * @default true
   */
  shouldRound?: boolean

  /**
   * Tolerance in pixels for fullscreen detection
   * @default 2
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

  /**
   * Checks if a rectangle represents a fullscreen element
   *
   * @param rect - The DOMRect or rect-like object to check
   * @param options - Configuration options for fullscreen detection
   * @returns Boolean indicating if the rectangle represents a fullscreen element
   */
  isFullscreenRect: (
    rect:
      | DOMRect
      | DOMRectReadOnly
      | { width: number; height: number; top: number; left: number }
      | null,
    options?: IFullscreenRectOptions
  ) => boolean
}
