import type { IDispatchEvent, IDispatchEventOptions } from '../interfaces'

/**
 * Dispatches a custom event with type safety and sensible defaults.
 *
 * @param name - The name of the custom event to dispatch
 * @param options - Configuration options including detail data and event behavior
 * @param target - The element to dispatch the event on (defaults to document)
 * @returns boolean indicating if the event was not canceled
 *
 * @example
 * ```typescript
 * // Basic usage
 * dispatchEvent('user-login', {
 *   detail: { userId: 123, username: 'john_doe' }
 * });
 *
 * // With custom target
 * const modal = document.querySelector('#modal');
 * dispatchEvent('modal-open', { detail: { modalId: 'settings' } }, modal);
 * ```
 */
export const dispatchEvent: IDispatchEvent = <T = any>(
  name: string,
  options: IDispatchEventOptions<T> = {},
  target: EventTarget | null = null
): boolean => {
  // Ensure we're in a browser environment
  if (typeof window === 'undefined' || typeof window.CustomEvent === 'undefined') {
    return false
  }

  // Determine target element, default to document
  const eventTarget = target || document

  // Return false if no valid target
  if (!eventTarget) {
    return false
  }

  // Extract options with sensible defaults
  const { detail, bubbles = true, cancelable = true, composed = false } = options

  try {
    // Create the custom event with specified options
    const eventInit: CustomEventInit<T> = {
      bubbles,
      cancelable,
      composed
    }

    // Only include detail if it's defined to satisfy exactOptionalPropertyTypes
    if (detail !== undefined) {
      eventInit.detail = detail
    }

    const customEvent = new window.CustomEvent(name, eventInit)

    // Dispatch the event and return whether it was not canceled
    return eventTarget.dispatchEvent(customEvent)
  } catch (error) {
    return false
  }
}
