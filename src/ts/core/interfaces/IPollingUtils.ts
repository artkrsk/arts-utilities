/**
 * Options for configuring variable polling behavior
 */
export interface IWaitForVariableOptions {
  /**
   * Interval in milliseconds between checks
   * @default 20
   */
  checkingInterval?: number

  /**
   * Maximum time in milliseconds to wait before timing out
   * @default 10000
   */
  timeout?: number
}

/**
 * Interface for polling utility functions
 */
export interface IPollingUtils {
  /**
   * Waits for a global variable to become available on the window object
   *
   * @param variable - The name of the variable to wait for on window object
   * @param options - Configuration options for polling behavior
   * @returns Promise that resolves with the variable value when found, or rejects on timeout
   */
  waitForVariable: (variable: string, options?: IWaitForVariableOptions) => Promise<any>
}
