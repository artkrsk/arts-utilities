import type { IResponsiveResize, TResponsiveResizeCallback } from '../interfaces'

/**
 * Responsive resize utility that handles viewport width and height changes differently
 * based on device capabilities (pointer type).
 *
 * Uses matchMedia to detect if the device has fine pointer capabilities (like desktop)
 * or coarse pointer (like touch devices). On fine pointer devices, it listens to both
 * width and height changes. On coarse pointer devices, it only listens to height changes
 * to avoid triggering on mobile virtual keyboard appearance.
 *
 * @example
 * ```typescript
 * // Basic usage
 * const { clear } = attachResponsiveResize(() => {
 *   console.log('Viewport changed!');
 * });
 *
 * // Clean up when needed
 * clear();
 * ```
 *
 * @example
 * ```typescript
 * // Without immediate call
 * const { clear } = attachResponsiveResize(handleResize, false);
 * ```
 */
export const attachResponsiveResize: IResponsiveResize = (
  callback: TResponsiveResizeCallback,
  immediateCall = true
) => {
  if (typeof callback !== 'function') {
    return { clear: () => {} }
  }

  // Create MediaQueryList for detecting pointer type
  const mqPointer = window.matchMedia('(hover: hover) and (pointer: fine)')

  // Track last known dimensions to prevent unnecessary callbacks
  let lastVW = window.innerWidth
  let lastVH = window.innerHeight

  /**
   * Handler for viewport width changes
   */
  const handleWidthChange = (): void => {
    if (lastVW !== window.innerWidth) {
      lastVW = window.innerWidth
      callback()
    }
  }

  /**
   * Handler for viewport height changes
   */
  const handleHeightChange = (): void => {
    if (lastVH !== window.innerHeight) {
      lastVH = window.innerHeight
      callback()
    }
  }

  /**
   * Handler for media query changes
   * @param event - MediaQueryListEvent or MediaQueryList
   * @param runCallback - Whether to run the callback immediately
   */
  const handleMediaQueryChange = (
    event: MediaQueryListEvent | MediaQueryList,
    runCallback = false
  ): void => {
    const matches = event.matches

    if (matches) {
      // Fine pointer device (desktop) - listen to height changes
      window.addEventListener('resize', handleHeightChange, false)
    } else {
      // Coarse pointer device (touch) - remove height listener
      window.removeEventListener('resize', handleHeightChange, false)
    }

    if (runCallback) {
      callback()
    }
  }

  /**
   * Cleanup function to remove all event listeners
   */
  const clear = (): void => {
    window.removeEventListener('resize', handleWidthChange, false)
    window.removeEventListener('resize', handleHeightChange, false)

    // Handle both modern and legacy MediaQueryList APIs
    if (typeof mqPointer.removeEventListener === 'function') {
      mqPointer.removeEventListener('change', handleMediaQueryChange)
    } else {
      // Legacy browsers
      mqPointer.removeListener(handleMediaQueryChange)
    }
  }

  // Always listen to width changes
  window.addEventListener('resize', handleWidthChange, false)

  // Set up initial state and listen to pointer type changes
  handleMediaQueryChange(mqPointer, immediateCall)

  // Handle both modern and legacy MediaQueryList APIs
  if (typeof mqPointer.addEventListener === 'function') {
    mqPointer.addEventListener('change', handleMediaQueryChange)
  } else {
    // Legacy browsers
    mqPointer.addListener(handleMediaQueryChange)
  }

  return { clear }
}
