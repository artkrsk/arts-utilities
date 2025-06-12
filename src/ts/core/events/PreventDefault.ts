import type { IPreventDefault } from '../interfaces'

/**
 * Prevents the default behavior of an event and stops its propagation.
 *
 * This utility is useful for blocking various browser default behaviors
 * such as scrolling, form submission, link navigation, etc.
 *
 * @param event - The event to prevent
 *
 * @example
 * ```typescript
 * // Prevent form submission
 * form.addEventListener('submit', preventDefault);
 *
 * // Prevent link navigation
 * link.addEventListener('click', preventDefault);
 *
 * // Prevent scrolling on touch
 * element.addEventListener('touchmove', preventDefault);
 * ```
 */
export const preventDefault: IPreventDefault = (event: {
  preventDefault(): void
  stopPropagation(): void
}): void => {
  let stopPropagationError: Error | null = null

  try {
    event.stopPropagation()
  } catch (error) {
    stopPropagationError = error as Error
  }

  event.preventDefault()

  // Re-throw the stopPropagation error if it occurred
  if (stopPropagationError) {
    throw stopPropagationError
  }
}
