/**
 * Callback function for responsive resize events
 */
export type TResponsiveResizeCallback = () => void

/**
 * Options for configuring the responsive resize utility
 */
export interface IResponsiveResizeOptions {
  /**
   * Callback function to execute when viewport changes
   */
  callback: TResponsiveResizeCallback

  /**
   * Whether to call the callback immediately upon attachment
   * @default true
   */
  immediateCall?: boolean
}

/**
 * Cleanup object returned by attachResponsiveResize
 */
export interface IResponsiveResizeCleanup {
  /**
   * Function to remove all event listeners and clean up
   */
  clear: () => void
}

/**
 * Interface for the responsive resize utility function
 */
export interface IResponsiveResize {
  /**
   * Attaches responsive resize listeners that handle viewport changes differently
   * based on device capabilities (pointer type)
   *
   * @param callback - Callback function to execute when viewport changes
   * @param immediateCall - Whether to call the callback immediately upon attachment (default: true)
   * @returns Cleanup object with clear function
   */
  (callback: TResponsiveResizeCallback, immediateCall?: boolean): IResponsiveResizeCleanup
}
