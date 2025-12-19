import type { IWaitForVariableOptions } from '../interfaces'

/**
 * Waits for a global variable to become available on the window object.
 * Useful for waiting for third-party libraries or scripts to load and expose their APIs.
 *
 * @param variable - The name of the variable to wait for on window object
 * @param options - Configuration options for polling behavior
 * @returns Promise that resolves with the variable value when found, or rejects on timeout
 *
 * @example
 * ```typescript
 * // Example 1: Wait for a library to load with default settings
 * try {
 *   const jQuery = await waitForVariable('jQuery');
 *   console.log('jQuery is now available:', jQuery);
 * } catch (error) {
 *   console.error('jQuery failed to load:', error);
 * }
 *
 * // Example 2: Wait with custom polling interval and timeout
 * try {
 *   const myLibrary = await waitForVariable('MyLibrary', {
 *     checkingInterval: 50,
 *     timeout: 5000
 *   });
 *   myLibrary.init();
 * } catch (error) {
 *   console.error('MyLibrary not available after 5 seconds');
 * }
 *
 * // Example 3: Wait for nested object properties
 * try {
 *   await waitForVariable('google');
 *   await waitForVariable('google.maps');
 *   const maps = (window as any).google.maps;
 *   // Now safe to use Google Maps API
 * } catch (error) {
 *   console.error('Google Maps API not available');
 * }
 *
 * // Example 4: Use with destructuring for immediate usage
 * const { init, version } = await waitForVariable('MyFramework');
 * console.log(`Framework v${version} loaded`);
 * init();
 * ```
 */
export const waitForVariable = async (
  variable: string,
  options: IWaitForVariableOptions = {}
): Promise<unknown> => {
  const { checkingInterval = 20, timeout = 10000 } = options

  return new Promise((resolve, reject) => {
    // Check if variable is already available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (window as any)[variable] !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve((window as any)[variable])
      return
    }

    const ticker = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof (window as any)[variable] !== 'undefined') {
        clearInterval(ticker)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolve((window as any)[variable])
      }
    }, checkingInterval)

    setTimeout(() => {
      clearInterval(ticker)
      reject(
        new Error(`Global variable "window.${variable}" is still not defined after ${timeout}ms.`)
      )
    }, timeout)
  })
}
