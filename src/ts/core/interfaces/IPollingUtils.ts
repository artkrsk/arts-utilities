/**
 * Configuration options for polling behavior when waiting for variables to become available.
 * Provides fine-grained control over timing and performance characteristics of variable polling.
 *
 * @example
 * ```typescript
 * // Fast polling for critical dependencies
 * const fastOptions: IWaitForVariableOptions = {
 *   checkingInterval: 10,  // Check every 10ms
 *   timeout: 5000         // Give up after 5 seconds
 * };
 *
 * // Conservative polling for large libraries
 * const conservativeOptions: IWaitForVariableOptions = {
 *   checkingInterval: 100, // Check every 100ms
 *   timeout: 30000        // Wait up to 30 seconds
 * };
 * ```
 */
export interface IWaitForVariableOptions {
  /**
   * Interval in milliseconds between variable existence checks.
   * Lower values provide faster detection but higher CPU usage.
   * Higher values are more performance-friendly but may delay detection.
   *
   * @default 20
   *
   * @example
   * ```typescript
   * // High-frequency polling for time-sensitive operations
   * checkingInterval: 5    // Check every 5ms
   *
   * // Standard polling for most use cases
   * checkingInterval: 20   // Check every 20ms (default)
   *
   * // Low-frequency polling for non-critical dependencies
   * checkingInterval: 200  // Check every 200ms
   * ```
   */
  checkingInterval?: number

  /**
   * Maximum time in milliseconds to wait before timing out and rejecting the promise.
   * Prevents infinite polling when variables never become available.
   *
   * @default 10000
   *
   * @example
   * ```typescript
   * // Quick timeout for optional features
   * timeout: 2000     // Give up after 2 seconds
   *
   * // Standard timeout for most libraries
   * timeout: 10000    // Give up after 10 seconds (default)
   *
   * // Extended timeout for large dependencies
   * timeout: 60000    // Give up after 1 minute
   * ```
   */
  timeout?: number
}

/**
 * Interface for polling utility functions that wait for asynchronous dependencies.
 * Particularly useful for waiting for third-party libraries, global variables,
 * or dynamically loaded scripts to become available before proceeding with initialization.
 *
 * @example
 * ```typescript
 * // Wait for jQuery to load before initializing plugins
 * await pollingUtils.waitForVariable('jQuery');
 * $('#myElement').somePlugin();
 *
 * // Wait for analytics library with custom timeout
 * try {
 *   await pollingUtils.waitForVariable('gtag', { timeout: 5000 });
 *   gtag('config', 'GA_MEASUREMENT_ID');
 * } catch (error) {
 *   console.warn('Analytics library not loaded, proceeding without tracking');
 * }
 *
 * // Wait for Elementor API in WordPress frontend
 * await pollingUtils.waitForVariable('elementorFrontend');
 * elementorFrontend.hooks.addAction('frontend/element_ready/widget', callback);
 * ```
 */
export interface IPollingUtils {
  /**
   * Waits for a global variable to become available on the window object.
   * Uses configurable polling to repeatedly check for variable existence until
   * found or timeout is reached. Essential for managing asynchronous dependencies.
   *
   * @param variable - The name of the variable to wait for on the window object
   * @param options - Configuration options for polling behavior and timing
   * @returns Promise that resolves with the variable value when found, or rejects on timeout
   *
   * @example
   * ```typescript
   * // Basic usage - wait for global library
   * const $ = await pollingUtils.waitForVariable('jQuery');
   * console.log('jQuery version:', $.fn.jquery);
   *
   * // With error handling
   * try {
   *   const api = await pollingUtils.waitForVariable('MyAPI', {
   *     checkingInterval: 50,
   *     timeout: 15000
   *   });
   *   api.initialize();
   * } catch (error) {
   *   console.error('Failed to load MyAPI:', error);
   *   useAlternativeImplementation();
   * }
   *
   * // Chain multiple dependencies
   * await pollingUtils.waitForVariable('gsap');
   * await pollingUtils.waitForVariable('ScrollTrigger');
   * gsap.registerPlugin(ScrollTrigger);
   *
   * // Conditional loading with timeout
   * const mapApi = await pollingUtils.waitForVariable('google.maps', {
   *   timeout: 8000
   * }).catch(() => null);
   *
   * if (mapApi) {
   *   initializeGoogleMaps();
   * } else {
   *   initializeAlternativeMap();
   * }
   * ```
   */
  waitForVariable: (variable: string, options?: IWaitForVariableOptions) => Promise<unknown>
}
