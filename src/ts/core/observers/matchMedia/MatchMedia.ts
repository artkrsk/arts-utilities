import { IMatchMedia, IMatchMediaCallbacks } from '../../interfaces'

/**
 * Wraps the window.matchMedia API to execute callbacks on media query changes.
 */
export class MatchMedia implements IMatchMedia {
  /** The MediaQueryList instance, or null if unavailable/destroyed. */
  private mediaQuery: MediaQueryList | null = null
  /** Callbacks to execute on match/no-match. */
  private callbacks: IMatchMediaCallbacks
  /** The CSS media query condition string. */
  private condition: string

  /** Handles the media query change event. */
  private handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
    const matches = 'matches' in event ? event.matches : this.mediaQuery?.matches

    if (matches) {
      this.callbacks.match?.()
    } else {
      this.callbacks.noMatch?.()
    }
  }

  /**
   * Creates a MatchMedia instance.
   * @param condition - The CSS media query string.
   * @param callbackMatch - Function to call when the query matches.
   * @param callbackNoMatch - Function to call when the query stops matching.
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
   * Initializes the MediaQueryList and attaches listeners.
   * Checks the initial state.
   */
  public init() {
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
   * Removes event listeners and cleans up the instance.
   */
  public destroy() {
    this.detachEvents()
    this.mediaQuery = null
  }

  /**
   * Creates and returns a MediaQueryList object, or null if unavailable.
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
   * Checks the initial state of the media query and calls the appropriate callback.
   */
  private checkInitialState() {
    if (!this.mediaQuery) {
      return
    }

    // Pass the mediaQuery itself to handleChange to check its current state
    this.handleChange(this.mediaQuery)
  }

  /**
   * Attaches the change event listener to the MediaQueryList.
   */
  private attachEvents() {
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
   * Detaches the change event listener from the MediaQueryList.
   */
  private detachEvents() {
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
