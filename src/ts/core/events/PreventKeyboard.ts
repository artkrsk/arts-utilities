import type { IPreventKeyboard } from '../interfaces'

/**
 * Modern key names for navigation keys that should be prevented during page lock
 */
const NAVIGATION_KEYS = [
  ' ', // Space
  'PageUp', // Page Up
  'PageDown', // Page Down
  'End', // End
  'Home', // Home
  'ArrowLeft', // Arrow Left
  'ArrowUp', // Arrow Up
  'ArrowRight', // Arrow Right
  'ArrowDown' // Arrow Down
] as const

/**
 * Legacy key codes for fallback browser support
 */
const LEGACY_KEY_CODES = [
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
 * Check if the event target is an input field where typing should be allowed
 */
const isInputField = (element: Element | null): boolean => {
  if (!element) return false

  const tagName = element.tagName.toLowerCase()

  // Check for input elements
  if (tagName === 'input') {
    const inputType = (element as HTMLInputElement).type.toLowerCase()
    // Allow typing in text-based inputs
    return ['text', 'password', 'email', 'search', 'tel', 'url', 'number'].includes(inputType)
  }

  // Check for textarea and contenteditable elements
  if (tagName === 'textarea') {
    return true
  }

  if (element.getAttribute('contenteditable') === 'true') {
    return true
  }

  return false
}

/**
 * Prevents the default behavior of keyboard events for navigation keys.
 *
 * This utility blocks common keyboard navigation keys that would normally
 * scroll the page or move focus, useful when implementing page locking.
 * It allows normal typing in input fields, textareas, and contenteditable elements.
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
  // Allow normal typing in input fields
  if (isInputField(event.target as Element)) {
    return
  }

  // Check using modern event.key first, fallback to legacy keyCode
  const shouldPrevent =
    NAVIGATION_KEYS.includes(event.key as any) || LEGACY_KEY_CODES.includes(event.keyCode as any)

  if (shouldPrevent) {
    event.preventDefault()
  }
}
