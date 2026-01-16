import type { IPageLock, IPageLockOptions } from '../interfaces'
import { preventDefault } from './PreventDefault'
import { preventDefaultSmart, captureTouchStart } from './PreventDefaultSmart'
import { preventKeyboard } from './PreventKeyboard'

/**
 * Page locking utility that prevents scrolling and keyboard navigation.
 *
 * This utility provides a way to lock the page by preventing wheel events,
 * touch move events, and optionally keyboard navigation. It's useful for
 * modal dialogs, overlays, or any scenario where you want to prevent
 * the user from scrolling the background content.
 *
 * Supports smart prevention mode that allows nested scrollable elements
 * (like modal content) to scroll while keeping the page locked.
 *
 * @param lock - Whether to lock (true) or unlock (false) the page
 * @param options - Configuration options for the lock behavior
 *
 * @example
 * ```typescript
 * // Lock the page with default options
 * pageLock(true);
 *
 * // Unlock the page
 * pageLock(false);
 *
 * // Lock with custom options
 * pageLock(true, {
 *   passive: false,
 *   lockKeyboard: true
 * });
 *
 * // Lock without keyboard blocking
 * pageLock(true, {
 *   lockKeyboard: false
 * });
 *
 * // Lock page but allow nested scrolling (e.g., modal with scrollable content)
 * pageLock(true, {
 *   passive: false,
 *   allowNestedScroll: true
 * });
 * ```
 */
export const pageLock: IPageLock = (
  lock: boolean = true,
  options: IPageLockOptions = {}
): void => {
  // Default options with null safety
  const {
    passive = false,
    lockKeyboard = true,
    allowNestedScroll = false
  } = options || {}

  // Ensure we're in a browser environment
  if (typeof window === 'undefined') {
    return
  }

  // Choose the appropriate prevention function
  const preventFunction = allowNestedScroll ? preventDefaultSmart : preventDefault

  if (lock) {
    // Add event listeners to prevent scrolling
    window.addEventListener('wheel', preventFunction, { passive })
    window.addEventListener('touchmove', preventFunction, { passive })

    // For smart prevention with touch, we need to capture touch start position
    if (allowNestedScroll) {
      window.addEventListener('touchstart', captureTouchStart, { passive: true })
    }

    // Optionally prevent keyboard navigation
    if (lockKeyboard) {
      window.addEventListener('keydown', preventKeyboard, { passive })
    }
  } else {
    // Remove all possible event listeners to ensure clean unlock
    // (handles case where lock/unlock options differ)
    window.removeEventListener('wheel', preventDefaultSmart)
    window.removeEventListener('wheel', preventDefault)
    window.removeEventListener('touchmove', preventDefaultSmart)
    window.removeEventListener('touchmove', preventDefault)
    window.removeEventListener('touchstart', captureTouchStart)

    if (lockKeyboard) {
      window.removeEventListener('keydown', preventKeyboard)
    }
  }
}
