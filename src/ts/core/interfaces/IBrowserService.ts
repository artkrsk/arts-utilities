/**
 * Interface for browser operations service.
 * Provides cross-browser compatibility for common browser detection and viewport operations.
 *
 * @example
 * ```typescript
 * // Use with dependency injection or service pattern
 * class ResponsiveComponent {
 *   constructor(private browser: IBrowserService) {}
 *
 *   updateLayout() {
 *     const isMobile = this.browser.matchMedia('(max-width: 768px)')
 *     const width = this.browser.getViewportWidth()
 *     const height = this.browser.getViewportHeight()
 *
 *     if (isMobile) {
 *       this.setupMobileLayout(width, height)
 *     } else {
 *       this.setupDesktopLayout(width, height)
 *     }
 *   }
 * }
 * ```
 */
export interface IBrowserService {
  /**
   * Check if a media query matches current browser state.
   * Provides a consistent interface for media query testing across browsers.
   *
   * @param query - CSS media query string to test
   * @returns True if the media query matches, false otherwise
   *
   * @example
   * ```typescript
   * const isMobile = browserService.matchMedia('(max-width: 768px)')
   * const isLandscape = browserService.matchMedia('(orientation: landscape)')
   * const prefersReducedMotion = browserService.matchMedia('(prefers-reduced-motion: reduce)')
   * ```
   */
  matchMedia: (query: string) => boolean

  /**
   * Get current viewport width accounting for cross-browser differences.
   * Returns the most accurate viewport width available in the current browser.
   *
   * @returns Viewport width in pixels, or 0 if unable to determine
   *
   * @example
   * ```typescript
   * const width = browserService.getViewportWidth()
   * if (width < 768) {
   *   // Apply mobile styles
   * } else if (width < 1024) {
   *   // Apply tablet styles
   * } else {
   *   // Apply desktop styles
   * }
   * ```
   */
  getViewportWidth: () => number

  /**
   * Get current viewport height accounting for mobile browser quirks.
   * Handles differences between mobile browsers that hide/show address bars.
   *
   * @returns Viewport height in pixels, or 0 if unable to determine
   *
   * @example
   * ```typescript
   * const height = browserService.getViewportHeight()
   * const isShortViewport = height < 500
   *
   * // Adjust layout for short viewports
   * if (isShortViewport) {
   *   element.classList.add('compact-layout')
   * }
   * ```
   */
  getViewportHeight: () => number

  /**
   * Check if the current page is loaded within an iframe.
   * Useful for detecting embedded contexts and adjusting behavior accordingly.
   *
   * @returns True if running in an iframe, false if in top-level window
   *
   * @example
   * ```typescript
   * if (browserService.isInIframe()) {
   *   // Disable certain features that don't work well in iframes
   *   disableFullscreenMode()
   *   hideNavigationElements()
   * } else {
   *   // Enable full functionality for top-level page
   *   enableFullscreenMode()
   *   showNavigationElements()
   * }
   * ```
   */
  isInIframe: () => boolean
}
