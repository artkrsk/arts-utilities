import type { IElementVisibilityOptions, IFullscreenRectOptions } from '../interfaces'

/**
 * Checks if an element is visible within the viewport boundaries.
 * Supports both partial and full visibility detection with configurable tolerance.
 *
 * @param element - The element to check for viewport visibility
 * @param options - Configuration options for visibility detection
 * @returns Boolean indicating if element is visible, or undefined if element is null/undefined
 *
 * @example
 * ```typescript
 * // Example 1: Check if element is partially visible (default)
 * const isVisible = elementIsVisibleInViewport(document.getElementById('myElement'));
 * // Result: true if any part of the element is visible
 *
 * // Example 2: Check if element is fully visible
 * const isFullyVisible = elementIsVisibleInViewport(element, {
 *   partiallyVisible: false
 * });
 * // Result: true only if the entire element is visible
 *
 * // Example 3: Check visibility with tolerance
 * const isVisibleWithTolerance = elementIsVisibleInViewport(element, {
 *   tolerance: 50
 * });
 * // Result: true if element is visible within 50px tolerance
 *
 * // Example 4: Strict full visibility check
 * const isStrictlyVisible = elementIsVisibleInViewport(element, {
 *   partiallyVisible: false,
 *   tolerance: 0
 * });
 * // Result: true only if element is completely within viewport bounds
 * ```
 */
export const elementIsVisibleInViewport = (
  element: Element | null,
  options: IElementVisibilityOptions = {}
): boolean | undefined => {
  if (!element) {
    return undefined
  }

  const { partiallyVisible = true, tolerance = 0 } = options
  const { top, left, bottom, right } = element.getBoundingClientRect()
  const { innerWidth, innerHeight } = window

  return partiallyVisible
    ? ((top > -tolerance && top <= innerHeight + tolerance) ||
        (bottom > -tolerance && bottom <= innerHeight + tolerance)) &&
        ((left > -tolerance && left <= innerWidth + tolerance) ||
          (right > -tolerance && right <= innerWidth + tolerance))
    : top >= -tolerance &&
        left >= -tolerance &&
        bottom <= innerHeight + tolerance &&
        right <= innerWidth + tolerance
}

/**
 * Checks if an element is visible by examining its CSS visibility and opacity properties.
 * Uses computed styles to determine if the element is actually visible to the user.
 *
 * @param element - The element to check for CSS visibility
 * @returns Boolean indicating if element is visible, or false if element is null/undefined
 *
 * @example
 * ```typescript
 * // Example 1: Check basic element visibility
 * const isVisible = elementIsVisible(document.getElementById('myElement'));
 * // Result: false if visibility: hidden or opacity: 0
 *
 * // Example 2: Use in conditional logic
 * const element = document.querySelector('.modal');
 * if (elementIsVisible(element)) {
 *   console.log('Modal is currently visible to users');
 * }
 *
 * // Example 3: Filter visible elements from a collection
 * const allElements = document.querySelectorAll('.item');
 * const visibleElements = Array.from(allElements).filter(elementIsVisible);
 * // Result: array containing only visible elements
 *
 * // Example 4: Handle null elements safely
 * const maybeElement = document.querySelector('.nonexistent');
 * const isVisible = elementIsVisible(maybeElement);
 * // Result: false (safe handling of null element)
 * ```
 */
export const elementIsVisible = (element: Element | null): boolean => {
  if (!element) {
    return false
  }

  const computedStyle = window.getComputedStyle(element)
  const visibility = computedStyle.getPropertyValue('visibility')
  const opacity = parseFloat(computedStyle.getPropertyValue('opacity'))

  return visibility === 'visible' && opacity > 0
}

/**
 * Checks if an element represents a fullscreen element by comparing its dimensions and position
 * to the window's viewport. Useful for detecting fullscreen overlays, modals, or video elements.
 *
 * @param element - The element to check for fullscreen dimensions
 * @param options - Configuration options for fullscreen detection
 * @returns Boolean indicating if the element represents a fullscreen element, or false if element is null/undefined
 *
 * @example
 * ```typescript
 * // Example 1: Check if element fills entire viewport
 * const element = document.getElementById('video-player');
 * const isFullscreen = isElementFullscreen(element);
 * // Result: true if element covers the entire viewport
 *
 * // Example 2: Check with custom tolerance
 * const isFullscreenWithTolerance = isElementFullscreen(element, {
 *   tolerance: 5
 * });
 * // Result: true if element is within 5px of fullscreen
 *
 * // Example 3: Disable rounding for precise measurements
 * const isPreciselyFullscreen = isElementFullscreen(element, {
 *   shouldRound: false,
 *   tolerance: 0
 * });
 * // Result: true only if exact fullscreen dimensions
 *
 * // Example 4: Handle null element safely
 * const maybeElement = document.querySelector('.nonexistent');
 * const isFullscreen = isElementFullscreen(maybeElement);
 * // Result: false (safe handling of null element)
 * ```
 */
export const isElementFullscreen = (
  element: Element | null,
  options: IFullscreenRectOptions = {}
): boolean => {
  if (!element) {
    return false
  }

  const rect = element.getBoundingClientRect()
  const { shouldRound = true, tolerance = 2 } = options

  const width = shouldRound ? Math.round(rect.width) : rect.width
  const height = shouldRound ? Math.round(rect.height) : rect.height
  const top = shouldRound ? Math.round(rect.top) : rect.top
  const left = shouldRound ? Math.round(rect.left) : rect.left

  const isWidthMatch = Math.abs(width - window.innerWidth) <= tolerance
  const isHeightMatch = Math.abs(height - window.innerHeight) <= tolerance
  const isTopMatch = Math.abs(top) <= tolerance
  const isLeftMatch = Math.abs(left) <= tolerance

  return isWidthMatch && isHeightMatch && isTopMatch && isLeftMatch
}
