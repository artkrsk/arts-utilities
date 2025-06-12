import type { IPageLock, IPageLockOptions } from '../interfaces'
import { preventDefault } from './PreventDefault'
import { preventKeyboard } from './PreventKeyboard'

/**
 * Page locking utility that prevents scrolling and keyboard navigation.
 * 
 * This utility provides a way to lock the page by preventing wheel events,
 * touch move events, and optionally keyboard navigation. It's useful for
 * modal dialogs, overlays, or any scenario where you want to prevent
 * the user from scrolling the background content.
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
 * ```
 */
export const pageLock: IPageLock = (
  lock: boolean = true,
  options: IPageLockOptions = {}
): void => {
  // Default options with null safety
  const {
    passive = false,
    lockKeyboard = true
  } = options || {}

  // Ensure we're in a browser environment
  if (typeof window === 'undefined') {
    return
  }

  if (lock) {
    // Add event listeners to prevent scrolling
    window.addEventListener('wheel', preventDefault, { passive })
    window.addEventListener('touchmove', preventDefault, { passive })

    // Optionally prevent keyboard navigation
    if (lockKeyboard) {
      window.addEventListener('keydown', preventKeyboard, { passive })
    }
  } else {
    // Remove event listeners to restore scrolling
    window.removeEventListener('wheel', preventDefault)
    window.removeEventListener('touchmove', preventDefault)

    // Remove keyboard prevention if it was enabled
    if (lockKeyboard) {
      window.removeEventListener('keydown', preventKeyboard)
    }
  }
}
