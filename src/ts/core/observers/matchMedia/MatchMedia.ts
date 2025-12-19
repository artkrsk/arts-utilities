import type { IMatchMedia, IMatchMediaCallbacks } from '../../interfaces'

/**
 * Enhanced wrapper around the window.matchMedia API that provides reliable media query
 * monitoring with callback execution. Handles both modern and legacy browser APIs.
 *
 * This class is particularly useful for:
 * - Responsive design breakpoint detection
 * - Device capability detection (hover, pointer precision)
 * - Orientation change handling
 * - Dynamic layout adjustments based on viewport changes
 *
 * @example
 * ```typescript
 * // Example 1: Basic breakpoint monitoring
 * const desktopQuery = new MatchMedia({
 *   condition: '(min-width: 1024px)',
 *   callbackMatch: () => console.log('Desktop layout active'),
 *   callbackNoMatch: () => console.log('Mobile/tablet layout active')
 * });
 *
 * // Example 2: Device capability detection
 * const touchDevice = new MatchMedia({
 *   condition: '(hover: none) and (pointer: coarse)',
 *   callbackMatch: () => enableTouchInteractions(),
 *   callbackNoMatch: () => enableMouseInteractions()
 * });
 *
 * // Example 3: Orientation monitoring
 * const orientationQuery = new MatchMedia({
 *   condition: '(orientation: landscape)',
 *   callbackMatch: () => adjustForLandscape(),
 *   callbackNoMatch: () => adjustForPortrait()
 * });
 *
 * // Example 4: Cleanup when component unmounts
 * const query = new MatchMedia({ condition: '(max-width: 768px)' });
 * // Later...
 * query.destroy(); // Remove listeners and cleanup
 * ```
 */
export class MatchMedia implements IMatchMedia {
  /** The MediaQueryList instance, or null if unavailable/destroyed. */
  private mediaQuery: MediaQueryList | null = null
  /** Callbacks to execute on match/no-match. */
  private callbacks: IMatchMediaCallbacks
  /** The CSS media query condition string. */
  private condition: string

  /**
   * Handles the media query change event.
   * Supports both MediaQueryListEvent (modern) and MediaQueryList (legacy) APIs.
   */
  private handleChange = (event: MediaQueryListEvent | MediaQueryList): void => {
    const matches = 'matches' in event ? event.matches : this.mediaQuery?.matches

    if (matches) {
      this.callbacks.match?.()
    } else {
      this.callbacks.noMatch?.()
    }
  }

  /**
   * Creates a new MatchMedia instance for monitoring a specific media query.
   *
   * @param condition - CSS media query string to monitor (e.g., '(min-width: 768px)')
   * @param callbackMatch - Function called when the media query starts matching
   * @param callbackNoMatch - Function called when the media query stops matching
   */
  constructor({
    condition,
    callbackMatch,
    callbackNoMatch
  }: {
    condition: string
    callbackMatch?: IMatchMediaCallbacks['match']
    callbackNoMatch?: IMatchMediaCallbacks['noMatch']
  }) {
    this.condition = condition

    this.callbacks = {}
    if (callbackMatch) {
      this.callbacks.match = callbackMatch
    }
    if (callbackNoMatch) {
      this.callbacks.noMatch = callbackNoMatch
    }

    if (this.callbacks.match || this.callbacks.noMatch) {
      this.init()
    }
  }

  /**
   * Initializes the MediaQueryList and attaches event listeners.
   * Automatically checks the initial state and triggers appropriate callbacks.
   * Prevents double initialization for safety.
   */
  public init(): void {
    // Prevent re-initialization
    if (this.mediaQuery) {
      return
    }

    this.mediaQuery = this.addMatchMedia()

    // If mediaQuery is null (env check failed), don't proceed
    if (!this.mediaQuery) {
      return
    }

    // Check initial state immediately
    this.checkInitialState()
    this.attachEvents()
  }

  /**
   * Removes all event listeners and cleans up the MediaQueryList instance.
   * Call this method when the component or feature using MatchMedia is destroyed
   * to prevent memory leaks.
   *
   * @example
   * ```typescript
   * const breakpointWatcher = new MatchMedia({
   *   condition: '(min-width: 768px)',
   *   callbackMatch: () => console.log('Desktop mode')
   * });
   *
   * // Later, when component unmounts or feature is disabled
   * breakpointWatcher.destroy();
   * ```
   */
  public destroy(): void {
    this.detachEvents()
    this.mediaQuery = null
  }

  /**
   * Creates and returns a MediaQueryList object with comprehensive error handling.
   * Validates the environment and media query syntax before creation.
   *
   * @returns MediaQueryList instance or null if creation fails
   */
  private addMatchMedia(): MediaQueryList | null {
    // Environment check
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      console.warn('MatchMedia: window.matchMedia is not available.')
      return null // Explicitly return null
    }
    try {
      return window.matchMedia(this.condition)
    } catch (e) {
      console.error('MatchMedia: Error creating MediaQueryList:', e)
      return null // Explicitly return null
    }
  }

  /**
   * Evaluates the current state of the media query and executes the appropriate callback.
   * This method is called immediately after initialization to handle the initial state.
   */
  private checkInitialState(): void {
    if (!this.mediaQuery) {
      return
    }

    // Pass the mediaQuery itself to handleChange to check its current state
    this.handleChange(this.mediaQuery)
  }

  /**
   * Attaches the change event listener to the MediaQueryList.
   * Supports both modern (addEventListener) and legacy (addListener) APIs
   * for maximum browser compatibility.
   */
  private attachEvents(): void {
    if (!this.mediaQuery) {
      return
    }

    // Use handleChange arrow function
    if (typeof this.mediaQuery.addEventListener === 'function') {
      this.mediaQuery.addEventListener('change', this.handleChange)
    } else if (typeof this.mediaQuery.addListener === 'function') {
      // Safari < 14 compatibility
      this.mediaQuery.addListener(this.handleChange)
    }
  }

  /**
   * Removes the change event listener from the MediaQueryList.
   * Supports both modern (removeEventListener) and legacy (removeListener) APIs
   * for clean teardown across all browsers.
   */
  private detachEvents(): void {
    if (!this.mediaQuery) {
      return
    }

    // Use handleChange arrow function
    if (typeof this.mediaQuery.removeEventListener === 'function') {
      this.mediaQuery.removeEventListener('change', this.handleChange)
    } else if (typeof this.mediaQuery.removeListener === 'function') {
      // Safari < 14 compatibility
      this.mediaQuery.removeListener(this.handleChange)
    }
  }
}
