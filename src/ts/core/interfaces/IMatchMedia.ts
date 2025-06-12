/**
 * Interface for managing media query change listeners with automatic cleanup.
 * Provides a clean way to register and unregister media query listeners for responsive design.
 *
 * @example
 * ```typescript
 * // Basic usage with media query matcher
 * const matcher: IMatchMedia = new MatchMedia('(min-width: 768px)', {
 *   match: () => console.log('Desktop view'),
 *   noMatch: () => console.log('Mobile view')
 * });
 *
 * // Clean up when component unmounts
 * useEffect(() => {
 *   return () => matcher.destroy();
 * }, []);
 * ```
 */
export interface IMatchMedia {
  /**
   * Detaches media query change listener and cleans up all associated resources.
   * Should be called when the component or utility is no longer needed to prevent memory leaks.
   *
   * @example
   * ```typescript
   * // Component cleanup
   * componentWillUnmount() {
   *   this.mediaQueryMatcher.destroy();
   * }
   *
   * // React Hook cleanup
   * useEffect(() => {
   *   return () => mediaQueryMatcher.destroy();
   * }, []);
   * ```
   */
  destroy(): void
}

/**
 * Callback functions for handling media query state changes.
 * Provides separate handlers for when media queries match and don't match,
 * enabling different behaviors for different viewport conditions.
 *
 * @example
 * ```typescript
 * // Responsive navigation callbacks
 * const callbacks: IMatchMediaCallbacks = {
 *   match: () => {
 *     // Desktop: Show full navigation
 *     navigation.classList.remove('mobile-menu');
 *     showAllMenuItems();
 *   },
 *   noMatch: () => {
 *     // Mobile: Show hamburger menu
 *     navigation.classList.add('mobile-menu');
 *     hideSecondaryMenuItems();
 *   }
 * };
 *
 * // Theme switching based on dark mode preference
 * const darkModeCallbacks: IMatchMediaCallbacks = {
 *   match: () => document.body.classList.add('dark-theme'),
 *   noMatch: () => document.body.classList.remove('dark-theme')
 * };
 * ```
 */
export interface IMatchMediaCallbacks {
  /**
   * Callback function executed when the media query matches the current viewport.
   * Use this to apply styles, behaviors, or layouts appropriate for the matching condition.
   *
   * @example
   * ```typescript
   * match: () => {
   *   // Enable touch gestures for mobile
   *   enableSwipeNavigation();
   *   // Load high-resolution images for retina displays
   *   loadHighResImages();
   * }
   * ```
   */
  match?: () => void

  /**
   * Callback function executed when the media query doesn't match the current viewport.
   * Use this to apply alternative styles, behaviors, or layouts for non-matching conditions.
   *
   * @example
   * ```typescript
   * noMatch: () => {
   *   // Disable touch gestures for desktop
   *   disableSwipeNavigation();
   *   // Load standard resolution images
   *   loadStandardImages();
   * }
   * ```
   */
  noMatch?: () => void
}
