/**
 * Configuration options for intersection callbacks that provide fine-grained control
 * over visibility detection and element tracking.
 *
 * This interface supports multiple callback patterns for different use cases:
 * - Single callback for general intersection handling
 * - Separate callbacks for entering and leaving viewport
 * - Debounced callbacks for performance optimization
 *
 * @example
 * ```typescript
 * // Example 1: Separate enter/exit callbacks
 * const lazyLoadCallbacks: IIntersectionCallbacks = {
 *   onIntersect: (targets, entries) => {
 *     entries.forEach(entry => {
 *       if (entry.isIntersecting) {
 *         loadImage(entry.target as HTMLImageElement);
 *       }
 *     });
 *   },
 *   offIntersect: (targets, entries) => {
 *     entries.forEach(entry => {
 *       if (!entry.isIntersecting) {
 *         pauseVideo(entry.target as HTMLVideoElement);
 *       }
 *     });
 *   }
 * };
 *
 * // Example 2: Analytics tracking with debouncing
 * const analyticsCallbacks: IIntersectionCallbacks = {
 *   onIntersect: (targets, entries) => {
 *     // Immediate tracking for critical elements
 *     trackElementVisibility(entries);
 *   },
 *   onIntersectDebounced: (targets, entries) => {
 *     // Debounced batch analytics updates
 *     sendAnalyticsBatch(entries);
 *   }
 * };
 *
 * // Example 3: Infinite scroll implementation
 * const infiniteScrollCallbacks: IIntersectionCallbacks = {
 *   onIntersect: (targets, entries) => {
 *     const trigger = entries.find(entry => entry.isIntersecting);
 *     if (trigger) {
 *       loadMoreContent();
 *     }
 *   }
 * };
 * ```
 */
export interface IIntersectionCallbacks {
  /**
   * Callback function executed when elements enter the viewport (become visible).
   * Called immediately when the intersection threshold is met.
   * Use for critical updates that need immediate response.
   *
   * @param targets - Array of elements that triggered the intersection
   * @param entries - Array of IntersectionObserverEntry objects with detailed intersection data
   *
   * @example
   * ```typescript
   * onIntersect: (targets, entries) => {
   *   entries.forEach(entry => {
   *     if (entry.isIntersecting) {
   *       // Element entered viewport
   *       entry.target.classList.add('visible');
   *       // Load content or start animations
   *       loadContent(entry.target);
   *     }
   *   });
   * }
   * ```
   */
  onIntersect?: (targets: Array<Element>, entries: Array<IntersectionObserverEntry>) => void

  /**
   * Callback function executed when elements leave the viewport (become hidden).
   * Called immediately when the element no longer meets the intersection threshold.
   * Use for cleanup operations and performance optimizations.
   *
   * @param targets - Array of elements that are no longer intersecting
   * @param entries - Array of IntersectionObserverEntry objects with detailed intersection data
   *
   * @example
   * ```typescript
   * offIntersect: (targets, entries) => {
   *   entries.forEach(entry => {
   *     if (!entry.isIntersecting) {
   *       // Element left viewport
   *       entry.target.classList.remove('visible');
   *       // Pause expensive operations
   *       pauseAnimations(entry.target);
   *     }
   *   });
   * }
   * ```
   */
  offIntersect?: (targets: Array<Element>, entries: Array<IntersectionObserverEntry>) => void

  /**
   * Debounced callback function for intersection events.
   * Useful for expensive operations that should not run on every intersection change.
   * Typically debounced externally to prevent excessive calls.
   *
   * @param targets - Array of elements that triggered the intersection
   * @param entries - Array of IntersectionObserverEntry objects with detailed intersection data
   *
   * @example
   * ```typescript
   * onIntersectDebounced: (targets, entries) => {
   *   // Expensive operations like API calls or complex calculations
   *   updateAnalytics(entries);
   *   recalculateLayout();
   *   optimizePerformance();
   * }
   * ```
   */
  onIntersectDebounced?: (
    targets: Array<Element>,
    entries: Array<IntersectionObserverEntry>
  ) => void

  /**
   * Debounced callback function for when elements leave the viewport.
   * Useful for cleanup operations that should be batched for performance.
   *
   * @param targets - Array of elements that are no longer intersecting
   * @param entries - Array of IntersectionObserverEntry objects with detailed intersection data
   *
   * @example
   * ```typescript
   * offIntersectDebounced: (targets, entries) => {
   *   // Batched cleanup operations
   *   cleanupResources(entries);
   *   saveUserProgress();
   *   updateCache();
   * }
   * ```
   */
  offIntersectDebounced?: (
    targets: Array<Element>,
    entries: Array<IntersectionObserverEntry>
  ) => void
}

/**
 * Interface for the Intersection observer utility that provides a consistent API
 * for element visibility detection and viewport intersection monitoring.
 *
 * This interface defines the contract for intersection observation with lifecycle
 * management methods for initialization, cleanup, and resource management.
 */
export interface IIntersection {
  /**
   * Initializes the IntersectionObserver and begins monitoring all specified elements.
   * This method should be called to start the observation process.
   *
   * @example
   * ```typescript
   * const observer = new Intersection({
   *   elements: [element1, element2],
   *   callbackIntersect: handleIntersection
   * });
   * observer.init(); // Start observing
   * ```
   */
  init(): void

  /**
   * Completely disconnects the IntersectionObserver and cleans up all resources.
   * Call this method when the observer is no longer needed to prevent memory leaks.
   *
   * @example
   * ```typescript
   * // Component cleanup or when observer is no longer needed
   * intersectionObserver.destroy();
   * ```
   */
  destroy(): void
}
