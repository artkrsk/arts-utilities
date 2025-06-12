import type { IBrowserService } from '../interfaces'

/**
 * Service for browser-related operations and viewport detection.
 * Provides safe, cross-browser methods for common browser tasks.
 */
class BrowserServiceClass {
  /**
   * Check if a CSS media query matches the current viewport and device capabilities.
   * Safely handles errors from malformed queries.
   *
   * @param query - CSS media query string to test
   * @returns True if the query matches current conditions, false otherwise or on error
   *
   * @example
   * ```typescript
   * // Example 1: Check viewport width
   * const isDesktop = BrowserService.matchMedia('(min-width: 1024px)');
   * // Result: true on desktop screens
   *
   * // Example 2: Check device capabilities
   * const hasFinePointer = BrowserService.matchMedia('(pointer: fine)');
   * // Result: true on devices with precise pointing (mouse)
   *
   * // Example 3: Check orientation
   * const isLandscape = BrowserService.matchMedia('(orientation: landscape)');
   * // Result: true when device is in landscape mode
   *
   * // Example 4: Complex media query
   * const isTablet = BrowserService.matchMedia('(min-width: 768px) and (max-width: 1023px)');
   * // Result: true for tablet-sized screens
   * ```
   */
  static matchMedia(query: string): boolean {
    try {
      return window.matchMedia(query).matches
    } catch (_error) {
      return false
    }
  }

  /**
   * Get current viewport width, accounting for different browsers and rendering modes.
   * Returns the larger of document.documentElement.clientWidth and window.innerWidth.
   *
   * @returns Viewport width in pixels, or 0 if unable to determine
   *
   * @example
   * ```typescript
   * // Example 1: Basic usage
   * const width = BrowserService.getViewportWidth();
   * // Result: 1920 (on a 1920px wide screen)
   *
   * // Example 2: Responsive logic
   * const isMobile = BrowserService.getViewportWidth() < 768;
   * if (isMobile) {
   *   console.log('Mobile layout active');
   * }
   *
   * // Example 3: Dynamic layout calculations
   * const containerWidth = BrowserService.getViewportWidth() * 0.8;
   * // Result: 80% of viewport width
   * ```
   */
  static getViewportWidth(): number {
    try {
      return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    } catch (_error) {
      return 0
    }
  }

  /**
   * Get current viewport height, accounting for different browsers and mobile browser quirks.
   * Returns the larger of document.documentElement.clientHeight and window.innerHeight.
   *
   * @returns Viewport height in pixels, or 0 if unable to determine
   *
   * @example
   * ```typescript
   * // Example 1: Basic usage
   * const height = BrowserService.getViewportHeight();
   * // Result: 1080 (on a 1080px tall screen)
   *
   * // Example 2: Full-height layout
   * const fullHeight = BrowserService.getViewportHeight();
   * element.style.height = `${fullHeight}px`;
   *
   * // Example 3: Above-the-fold detection
   * const elementTop = element.getBoundingClientRect().top;
   * const isAboveFold = elementTop < BrowserService.getViewportHeight();
   * ```
   */
  static getViewportHeight(): number {
    try {
      return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    } catch (_error) {
      return 0
    }
  }

  /**
   * Detect if the current page is loaded within an iframe context.
   * Handles same-origin policy restrictions gracefully.
   *
   * @returns True if running in an iframe, false if in main window context
   *
   * @example
   * ```typescript
   * // Example 1: Basic iframe detection
   * const inFrame = BrowserService.isInIframe();
   * if (inFrame) {
   *   console.log('Running inside an iframe');
   * }
   *
   * // Example 2: Conditional functionality
   * if (BrowserService.isInIframe()) {
   *   // Disable features that don't work well in iframes
   *   disableFullscreenMode();
   * }
   *
   * // Example 3: Elementor editor detection
   * const isElementorEditor = BrowserService.isInIframe() &&
   *   window.location.href.includes('elementor');
   * ```
   */
  static isInIframe(): boolean {
    try {
      return window.self !== window.top
    } catch (_error) {
      // If we can't access window.top due to same-origin policy,
      // we're definitely in an iframe
      return true
    }
  }
}

export const BrowserService: IBrowserService = {
  matchMedia: BrowserServiceClass.matchMedia,
  getViewportWidth: BrowserServiceClass.getViewportWidth,
  getViewportHeight: BrowserServiceClass.getViewportHeight,
  isInIframe: BrowserServiceClass.isInIframe
}
