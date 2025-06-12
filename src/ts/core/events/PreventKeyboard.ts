import type { IPreventKeyboard } from '../interfaces'

/**
 * Key codes for common navigation keys that should be prevented during page lock
 */
const NAVIGATION_KEYS = [
  32, // Space
  33, // Page Up
  34, // Page Down
  35, // End
  36, // Home
  37, // Arrow Left
  38, // Arrow Up
  39, // Arrow Right
  40 // Arrow Down
] as const

/**
 * Prevents the default behavior of keyboard events for navigation keys.
 *
 * This utility blocks common keyboard navigation keys that would normally
 * scroll the page or move focus, useful when implementing page locking.
 *
 * @param event - The keyboard event to potentially prevent
 *
 * @example
 * ```typescript
 * // Block navigation keys
 * window.addEventListener('keydown', preventKeyboard);
 *
 * // Use with specific elements
 * modal.addEventListener('keydown', preventKeyboard);
 * ```
 */
export const preventKeyboard: IPreventKeyboard = (event: KeyboardEvent): void => {
  if (NAVIGATION_KEYS.includes(event.keyCode as any)) {
    event.preventDefault()
  }
}
