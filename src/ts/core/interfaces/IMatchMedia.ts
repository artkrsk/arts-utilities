export interface IMatchMedia {
  /**
   * Detach media query change listener
   */
  destroy(): void
}

export interface IMatchMediaCallbacks {
  /**
   * Callback function if when media query matches
   */
  match?: () => void
  /**
   * Callback function if when media query doesn't match
   */
  noMatch?: () => void
}
