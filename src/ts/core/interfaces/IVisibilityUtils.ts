/**
 * Configuration options for viewport visibility detection with fine-grained control.
 * Allows customization of visibility thresholds and detection behavior for different use cases.
 *
 * @example
 * ```typescript
 * // Strict visibility (fully visible)
 * const strictOptions: IElementVisibilityOptions = {
 *   partiallyVisible: false,
 *   tolerance: 0
 * };
 *
 * // Lenient visibility for lazy loading
 * const lazyLoadOptions: IElementVisibilityOptions = {
 *   partiallyVisible: true,
 *   tolerance: 100  // Trigger 100px before element enters viewport
 * };
 *
 * // Animation trigger options
 * const animationOptions: IElementVisibilityOptions = {
 *   partiallyVisible: true,
 *   tolerance: 50   // Start animation when 50px visible
 * };
 * ```
 */
export interface IElementVisibilityOptions {
  /**
   * Whether to consider partially visible elements as visible.
   * When true, elements are considered visible if any part is in the viewport.
   * When false, elements must be completely visible within the viewport.
   *
   * @default true
   *
   * @example
   * ```typescript
   * // For lazy loading images (trigger early)
   * partiallyVisible: true
   *
   * // For important content that should be fully visible
   * partiallyVisible: false
   *
   * // For scroll-triggered animations
   * partiallyVisible: true
   * ```
   */
  partiallyVisible?: boolean

  /**
   * Tolerance in pixels for visibility detection, extending the effective viewport.
   * Positive values expand the detection area beyond the viewport boundaries.
   * Negative values shrink the detection area within the viewport.
   *
   * @default 0
   *
   * @example
   * ```typescript
   * // Preload content 200px before it becomes visible
   * tolerance: 200
   *
   * // Only trigger when element is well within viewport
   * tolerance: -50
   *
   * // Exact viewport boundary detection
   * tolerance: 0
   * ```
   */
  tolerance?: number
}

/**
 * Configuration options for fullscreen rectangle detection with precision control.
 * Provides flexibility in determining when elements should be considered fullscreen,
 * accounting for browser variations and layout tolerances.
 *
 * @example
 * ```typescript
 * // Precise fullscreen detection
 * const preciseOptions: IFullscreenRectOptions = {
 *   shouldRound: false,
 *   tolerance: 0
 * };
 *
 * // Flexible fullscreen detection for cross-browser compatibility
 * const flexibleOptions: IFullscreenRectOptions = {
 *   shouldRound: true,
 *   tolerance: 5
 * };
 * ```
 */
export interface IFullscreenRectOptions {
  /**
   * Whether to round dimensions and position values before comparison.
   * Helps account for sub-pixel rendering differences across browsers.
   * Recommended for cross-browser compatibility.
   *
   * @default true
   *
   * @example
   * ```typescript
   * // Handle sub-pixel differences in modern browsers
   * shouldRound: true
   *
   * // Precise floating-point comparison (may be unreliable)
   * shouldRound: false
   * ```
   */
  shouldRound?: boolean

  /**
   * Tolerance in pixels for fullscreen detection.
   * Accounts for browser UI elements, scrollbars, or other layout variations
   * that might prevent perfect fullscreen dimensions.
   *
   * @default 2
   *
   * @example
   * ```typescript
   * // Strict fullscreen detection
   * tolerance: 0
   *
   * // Allow for browser chrome variations
   * tolerance: 5
   *
   * // Generous tolerance for mobile browsers
   * tolerance: 10
   * ```
   */
  tolerance?: number
}

/**
 * Interface for element visibility utility functions providing comprehensive visibility detection.
 * Offers multiple visibility checking methods for different scenarios including viewport visibility,
 * CSS visibility, and fullscreen detection. Essential for lazy loading, animations, and responsive design.
 *
 * @example
 * ```typescript
 * // Lazy loading implementation
 * const images = document.querySelectorAll('img[data-src]');
 * images.forEach(img => {
 *   if (visibilityUtils.elementIsVisibleInViewport(img, { tolerance: 100 })) {
 *     img.src = img.dataset.src;
 *     img.removeAttribute('data-src');
 *   }
 * });
 *
 * // Scroll-triggered animations
 * const animatedElements = document.querySelectorAll('.animate-on-scroll');
 * window.addEventListener('scroll', () => {
 *   animatedElements.forEach(element => {
 *     if (visibilityUtils.elementIsVisibleInViewport(element, { partiallyVisible: true })) {
 *       element.classList.add('animate');
 *     }
 *   });
 * });
 *
 * // Fullscreen video detection
 * const video = document.querySelector('video');
 * if (visibilityUtils.isFullscreenRect(video.getBoundingClientRect())) {
 *   enableFullscreenControls();
 * }
 * ```
 */
export interface IVisibilityUtils {
  /**
   * Checks if an element is visible within the viewport boundaries.
   * Considers element position relative to the current viewport and applies
   * configurable tolerance and partial visibility rules.
   *
   * @param element - The element to check for viewport visibility
   * @param options - Configuration options for visibility detection behavior
   * @returns Boolean indicating visibility status, or undefined if element is null
   *
   * @example
   * ```typescript
   * // Basic viewport visibility check
   * const isVisible = visibilityUtils.elementIsVisibleInViewport(element);
   *
   * // Lazy loading with early trigger
   * const shouldLoad = visibilityUtils.elementIsVisibleInViewport(image, {
   *   tolerance: 200,        // Load 200px before entering viewport
   *   partiallyVisible: true // Trigger on any part visible
   * });
   *
   * // Animation trigger when fully visible
   * const shouldAnimate = visibilityUtils.elementIsVisibleInViewport(card, {
   *   partiallyVisible: false, // Must be completely visible
   *   tolerance: -20           // Must be 20px within viewport
   * });
   *
   * // Safe checking with null handling
   * const element = document.querySelector('.optional-element');
   * const isVisible = visibilityUtils.elementIsVisibleInViewport(element);
   * if (isVisible === true) {
   *   startAnimation();
   * } else if (isVisible === false) {
   *   stopAnimation();
   * }
   * // isVisible === undefined when element is null
   * ```
   */
  elementIsVisibleInViewport: (
    element: Element | null,
    options?: IElementVisibilityOptions
  ) => boolean | undefined

  /**
   * Checks if an element is visible (not hidden by CSS properties).
   * Examines CSS display, visibility, and opacity properties to determine
   * if an element is rendered and visible to users.
   *
   * @param element - The element to check for CSS visibility
   * @returns Boolean indicating if element is visible, or false if element is null
   *
   * @example
   * ```typescript
   * // Check if modal is visible before interacting
   * const modal = document.getElementById('modal');
   * if (visibilityUtils.elementIsVisible(modal)) {
   *   modal.focus();
   *   trapFocus(modal);
   * }
   *
   * // Conditional event handling based on visibility
   * const sidebar = document.querySelector('.sidebar');
   * if (visibilityUtils.elementIsVisible(sidebar)) {
   *   setupSidebarInteractions();
   * } else {
   *   setupMobileNavigation();
   * }
   *
   * // Form validation with visibility checks
   * const errorMessage = document.querySelector('.error-message');
   * if (!visibilityUtils.elementIsVisible(errorMessage)) {
   *   showErrorMessage(errorMessage);
   * }
   *
   * // Safe checking with potentially missing elements
   * const optionalWidget = document.querySelector('.optional-widget');
   * const isVisible = visibilityUtils.elementIsVisible(optionalWidget);
   * // Returns false for null elements (safe default)
   * ```
   */
  elementIsVisible: (element: Element | null) => boolean

  /**
   * Checks if a rectangle represents a fullscreen element.
   * Compares rectangle dimensions and position against viewport size
   * to determine if an element occupies the full screen area.
   *
   * @param rect - The rectangle object to check for fullscreen dimensions
   * @param options - Configuration options for fullscreen detection accuracy
   * @returns Boolean indicating if the rectangle represents a fullscreen element
   *
   * @example
   * ```typescript
   * // Video player fullscreen detection
   * const video = document.querySelector('video');
   * const rect = video.getBoundingClientRect();
   * if (visibilityUtils.isFullscreenRect(rect)) {
   *   showFullscreenControls();
   *   hidePageHeader();
   * } else {
   *   showInlineControls();
   *   showPageHeader();
   * }
   *
   * // Modal fullscreen detection
   * const modal = document.querySelector('.modal');
   * const isFullscreen = visibilityUtils.isFullscreenRect(
   *   modal.getBoundingClientRect(),
   *   { tolerance: 10 } // Allow for browser chrome
   * );
   *
   * // Image gallery fullscreen mode
   * const image = document.querySelector('.gallery-image');
   * if (visibilityUtils.isFullscreenRect(image.getBoundingClientRect())) {
   *   enableFullscreenGestures();
   *   hideGalleryThumbnails();
   * }
   *
   * // Handle different rect types
   * const element = document.querySelector('.expandable');
   * const domRect = element.getBoundingClientRect(); // DOMRect
   * const customRect = { width: 1920, height: 1080, top: 0, left: 0 }; // Custom
   *
   * const isFullscreenDom = visibilityUtils.isFullscreenRect(domRect);
   * const isFullscreenCustom = visibilityUtils.isFullscreenRect(customRect);
   *
   * // Safe handling of null rects
   * const nullableRect = maybeGetRect();
   * const isFullscreen = visibilityUtils.isFullscreenRect(nullableRect);
   * // Returns false for null rects (safe default)
   * ```
   */
  isFullscreenRect: (
    rect:
      | DOMRect
      | DOMRectReadOnly
      | { width: number; height: number; top: number; left: number }
      | null,
    options?: IFullscreenRectOptions
  ) => boolean
}
