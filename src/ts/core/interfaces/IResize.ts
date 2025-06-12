/**
 * Interface for managing ResizeObserver instances with lifecycle methods.
 * Provides a structured way to observe element size changes with automatic cleanup capabilities.
 * Ideal for responsive components, layout adjustments, and performance-optimized resize handling.
 *
 * @example
 * ```typescript
 * // Responsive card grid that adjusts layout based on container size
 * const cardGridResize: IResize = new Resize('#card-grid', {
 *   onResize: (targets, entries) => {
 *     const containerWidth = entries[0].contentRect.width;
 *     adjustCardLayout(containerWidth);
 *   },
 *   onResizeDebounced: (targets, entries) => {
 *     // Expensive operations run debounced
 *     recalculateVirtualScrolling(entries[0].contentRect);
 *   }
 * });
 *
 * cardGridResize.init();
 *
 * // Cleanup when component unmounts
 * useEffect(() => {
 *   return () => cardGridResize.destroy();
 * }, []);
 * ```
 */
export interface IResize {
  /**
   * Initializes the ResizeObserver and starts observing target elements.
   * Sets up the observer configuration and begins tracking size changes on specified elements.
   *
   * @example
   * ```typescript
   * // Initialize chart resize observer
   * const chartResize = new Resize('.chart-container', {
   *   onResize: (targets, entries) => {
   *     chart.resize(entries[0].contentRect.width, entries[0].contentRect.height);
   *   }
   * });
   *
   * // Start observing after chart is ready
   * chartResize.init();
   * ```
   */
  init(): void

  /**
   * Disconnects the ResizeObserver and cleans up the instance.
   * Stops observing all elements and releases associated resources to prevent memory leaks.
   *
   * @example
   * ```typescript
   * // Component lifecycle cleanup
   * componentWillUnmount() {
   *   this.resizeObserver.destroy();
   * }
   *
   * // Route change cleanup
   * router.beforeEach(() => {
   *   resizeObserver.destroy();
   * });
   *
   * // Conditional cleanup based on viewport
   * if (window.innerWidth < 768) {
   *   desktopResizeObserver.destroy();
   * }
   * ```
   */
  destroy(): void
}

/**
 * Callback functions for handling element resize events with different performance characteristics.
 * Provides both immediate and debounced callbacks to balance responsiveness with performance.
 *
 * @example
 * ```typescript
 * // Performance-optimized image gallery
 * const galleryCallbacks: IResizeCallbacks = {
 *   onResize: (targets, entries) => {
 *     // Immediate: Update critical layout
 *     updateImageGridLayout(entries);
 *   },
 *   onResizeDebounced: (targets, entries) => {
 *     // Debounced: Expensive operations
 *     recalculateImageSizes(entries);
 *     updateLazyLoadingThresholds(entries);
 *   }
 * };
 *
 * // Responsive text editor
 * const editorCallbacks: IResizeCallbacks = {
 *   onResize: (targets, entries) => {
 *     // Immediate: Update line numbers visibility
 *     toggleLineNumbers(entries[0].contentRect.width > 600);
 *   },
 *   onResizeDebounced: (targets, entries) => {
 *     // Debounced: Recalculate syntax highlighting
 *     recalculateHighlighting();
 *   }
 * };
 * ```
 */
export interface IResizeCallbacks {
  /**
   * Immediate callback function executed when elements are resized.
   * Called on every resize event without debouncing for responsive, real-time updates.
   * Use for critical UI updates that need immediate response.
   *
   * @param targets - Array of elements being observed
   * @param entries - Array of ResizeObserverEntry objects containing size information
   *
   * @example
   * ```typescript
   * onResize: (targets, entries) => {
   *   // Immediate responsive adjustments
   *   entries.forEach(entry => {
   *     const element = entry.target as HTMLElement;
   *     const width = entry.contentRect.width;
   *
   *     // Toggle mobile/desktop class immediately
   *     element.classList.toggle('mobile-layout', width < 768);
   *
   *     // Update CSS custom properties for immediate effect
   *     element.style.setProperty('--container-width', `${width}px`);
   *   });
   * }
   * ```
   */
  onResize?: (targets: Array<Element>, entries: Array<ResizeObserverEntry>) => void

  /**
   * Debounced callback function executed when elements are resized.
   * Called after a delay when resize events stop firing, preventing excessive execution
   * of expensive operations during continuous resizing.
   *
   * @param targets - Array of elements being observed
   * @param entries - Array of ResizeObserverEntry objects containing size information
   *
   * @example
   * ```typescript
   * onResizeDebounced: (targets, entries) => {
   *   // Expensive operations run after resize settles
   *   entries.forEach(entry => {
   *     const width = entry.contentRect.width;
   *
   *     // Recalculate complex layouts
   *     recalculateMasonryGrid(entry.target);
   *
   *     // Update charts and visualizations
   *     updateDataVisualization(width, entry.contentRect.height);
   *
   *     // Lazy load content based on new dimensions
   *     updateLazyLoadingThresholds(entry.target, width);
   *   });
   * }
   * ```
   */
  onResizeDebounced?: (targets: Array<Element>, entries: Array<ResizeObserverEntry>) => void
}
