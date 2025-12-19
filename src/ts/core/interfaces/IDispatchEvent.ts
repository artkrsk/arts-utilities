/**
 * Configuration options for custom event dispatching with enhanced control.
 * Provides comprehensive options for event bubbling, cancellation, and data passing.
 *
 * @example
 * ```typescript
 * // Simple data payload
 * const simpleOptions: IDispatchEventOptions = {
 *   detail: { userId: 123, action: 'login' }
 * };
 *
 * // Full control event
 * const controlledOptions: IDispatchEventOptions = {
 *   detail: { message: 'Critical update' },
 *   bubbles: true,
 *   cancelable: true,
 *   composed: true
 * };
 *
 * // Non-bubbling internal event
 * const internalOptions: IDispatchEventOptions = {
 *   detail: { internalState: 'updated' },
 *   bubbles: false,
 *   cancelable: false
 * };
 * ```
 */
export interface IDispatchEventOptions<T = unknown> {
  /**
   * Custom data to include with the event.
   * This data will be available in event listeners via event.detail.
   *
   * @example
   * ```typescript
   * // User action data
   * detail: { userId: 123, action: 'save', timestamp: Date.now() }
   *
   * // Component state
   * detail: { visible: true, animation: 'fade-in' }
   * ```
   */
  detail?: T

  /**
   * Whether the event bubbles up through the DOM tree.
   * Defaults to true to match standard DOM event behavior.
   *
   * @default true
   *
   * @example
   * ```typescript
   * // Event that bubbles (default)
   * bubbles: true
   *
   * // Event contained to target element
   * bubbles: false
   * ```
   */
  bubbles?: boolean

  /**
   * Whether the event can be canceled with preventDefault().
   * Defaults to true to allow event cancellation when needed.
   *
   * @default true
   *
   * @example
   * ```typescript
   * // Cancelable event (default)
   * cancelable: true
   *
   * // Information-only event
   * cancelable: false
   * ```
   */
  cancelable?: boolean

  /**
   * Whether the event can cross shadow DOM boundaries.
   * Useful for custom elements and web components.
   *
   * @default false
   *
   * @example
   * ```typescript
   * // Event crosses shadow boundaries
   * composed: true
   *
   * // Event stays within shadow DOM
   * composed: false
   * ```
   */
  composed?: boolean
}

/**
 * Interface for custom event dispatching utility providing type-safe event creation and dispatch.
 * Simplifies the process of creating and dispatching custom DOM events with consistent behavior.
 *
 * @example
 * ```typescript
 * // Basic event dispatch
 * dispatchEvent('user-login', { detail: { userId: 123 } });
 *
 * // Dispatch to specific element
 * const button = document.querySelector('#submit-btn');
 * dispatchEvent('form-submitted', { detail: formData }, button);
 *
 * // Component communication
 * dispatchEvent('modal-closed', {
 *   detail: { reason: 'user-action', timestamp: Date.now() },
 *   bubbles: true
 * });
 * ```
 */
export interface IDispatchEvent {
  /**
   * Dispatches a custom event with optional configuration and target element.
   * Creates a CustomEvent and dispatches it to the specified target or document.
   * Provides type safety and consistent defaults for reliable event handling.
   *
   * @param eventName - The name of the custom event to dispatch
   * @param options - Configuration options for the event (detail, bubbling, etc.)
   * @param target - The element to dispatch the event on (defaults to document)
   * @returns boolean indicating if the event was not canceled (true) or was canceled (false)
   *
   * @example
   * ```typescript
   * // Simple notification event
   * dispatchEvent('notification-shown', {
   *   detail: { message: 'Success!', type: 'success' }
   * });
   *
   * // User interaction tracking
   * const button = document.querySelector('#cta-button');
   * dispatchEvent('user-interaction', {
   *   detail: { element: 'cta-button', action: 'click' },
   *   bubbles: true
   * }, button);
   *
   * // Component lifecycle events
   * dispatchEvent('component-mounted', {
   *   detail: { componentId: 'header', timestamp: Date.now() },
   *   bubbles: false,
   *   cancelable: false
   * });
   *
   * // Cross-component communication
   * const result = dispatchEvent('data-requested', {
   *   detail: { endpoint: '/api/users', method: 'GET' },
   *   cancelable: true
   * });
   *
   * if (!result) {
   *   console.log('Data request was canceled');
   * }
   *
   * // Modal/dialog events
   * dispatchEvent('modal-opening', {
   *   detail: { modalId: 'user-settings', trigger: 'menu-click' },
   *   bubbles: true,
   *   cancelable: true
   * });
   * ```
   */
  <T = unknown>(
    eventName: string,
    options?: IDispatchEventOptions<T>,
    target?: EventTarget | null
  ): boolean
}
