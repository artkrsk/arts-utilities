import type { IResize, IResizeCallbacks } from '../../interfaces'
import { isHTMLElement } from '../../dom'

/**
 * Advanced wrapper around the ResizeObserver API that provides reliable element resize monitoring
 * with comprehensive error handling and cross-browser compatibility.
 *
 * This class offers several advantages over direct ResizeObserver usage:
 * - Automatic element validation and filtering
 * - Support for both immediate and debounced callbacks
 * - Graceful degradation when ResizeObserver is unavailable
 * - Clean lifecycle management with proper cleanup
 * - Environment checks for SSR compatibility
 *
 * Common use cases:
 * - Dynamic layout adjustments based on container size changes
 * - Image lazy loading and optimization
 * - Chart and visualization responsiveness
 * - Modal and overlay positioning
 * - Infinite scroll implementations
 * - Responsive component behavior
 *
 * @example
 * ```typescript
 * // Example 1: Basic element monitoring
 * const container = document.getElementById('dynamic-container');
 * const resizeObserver = new Resize({
 *   elements: [container],
 *   callbackResize: (targets, entries) => {
 *     console.log('Elements resized:', targets.length);
 *     // Adjust layout immediately
 *     adjustLayout(entries);
 *   }
 * });
 *
 * // Example 2: Chart responsiveness with debouncing
 * const chartElement = document.querySelector('.chart-container');
 * const chartResize = new Resize({
 *   elements: [chartElement],
 *   callbackResize: (targets, entries) => {
 *     // Immediate callback for critical updates
 *     showResizeIndicator();
 *   },
 *   callbackResizeDebounced: (targets, entries) => {
 *     // Debounced callback for expensive operations
 *     redrawChart(entries[0].contentRect);
 *     hideResizeIndicator();
 *   }
 * });
 *
 * // Example 3: Multiple element monitoring
 * const gridItems = Array.from(document.querySelectorAll('.grid-item'));
 * const gridResize = new Resize({
 *   elements: gridItems,
 *   callbackResize: (targets, entries) => {
 *     // Update grid layout when any item resizes
 *     recalculateGrid(entries);
 *   }
 * });
 *
 * // Example 4: Component lifecycle integration
 * class ResponsiveComponent {
 *   private resizeObserver: Resize;
 *
 *   constructor(element: HTMLElement) {
 *     this.resizeObserver = new Resize({
 *       elements: [element],
 *       callbackResize: this.handleResize.bind(this)
 *     });
 *   }
 *
 *   destroy() {
 *     this.resizeObserver.destroy(); // Clean up observers
 *   }
 *
 *   private handleResize(targets: Element[], entries: ResizeObserverEntry[]) {
 *     this.updateComponentSize(entries[0].contentRect);
 *   }
 * }
 * ```
 */
export class Resize implements IResize {
  /** The ResizeObserver instance, or null if unavailable/destroyed. */
  private instance: ResizeObserver | null = null
  /** Array of HTML elements to observe for resize changes. */
  private elements: Array<HTMLElement> = []
  /** Callbacks to execute on resize events. */
  private callbacks: IResizeCallbacks

  /**
   * Handles the ResizeObserver callback with entry processing.
   * Extracts target elements and calls both immediate and debounced callbacks.
   */
  private handleResize = (entries: Array<ResizeObserverEntry>): void => {
    const targets: Array<Element> = []

    for (const entry of entries) {
      targets.push(entry.target)
    }

    if (this.callbacks.onResize) {
      this.callbacks.onResize(targets, entries)
    }

    if (this.callbacks.onResizeDebounced) {
      this.callbacks.onResizeDebounced(targets, entries)
    }
  }

  /**
   * Creates a new Resize observer instance and automatically initializes if valid elements and callbacks are provided.
   *
   * @param elements - Array of HTML elements to monitor for size changes
   * @param callbackResize - Immediate callback executed on every resize event
   * @param callbackResizeDebounced - Debounced callback for expensive operations (typically debounced externally)
   */
  constructor({
    elements,
    callbackResize,
    callbackResizeDebounced
  }: {
    elements: Array<HTMLElement>
    callbackResize?: IResizeCallbacks['onResize']
    callbackResizeDebounced?: IResizeCallbacks['onResizeDebounced']
  }) {
    this.elements = elements

    this.callbacks = {}
    if (callbackResize) {
      this.callbacks.onResize = callbackResize
    }
    if (callbackResizeDebounced) {
      this.callbacks.onResizeDebounced = callbackResizeDebounced
    }

    if (this.elements.length && (this.callbacks.onResize || this.callbacks.onResizeDebounced)) {
      this.init()
    }
  }

  /**
   * Initializes the ResizeObserver and begins monitoring all specified elements.
   * Performs environment checks and prevents double initialization.
   *
   * @example
   * ```typescript
   * const observer = new Resize({
   *   elements: [element],
   *   callbackResize: handleResize
   * });
   * // Observer automatically initializes in constructor
   *
   * // Or manually initialize later:
   * const observer = new Resize({ elements: [] }); // No auto-init
   * observer.init(); // Manual initialization
   * ```
   */
  public init(): void {
    // Prevent re-initialization
    if (this.instance) {
      return
    }

    this.instance = this.createResizeObserver()

    // If instance is null (env check failed), don't proceed
    if (!this.instance) {
      return
    }

    this.observeElements()
  }

  /**
   * Completely disconnects the ResizeObserver and cleans up all resources.
   * Call this method when the observer is no longer needed to prevent memory leaks.
   *
   * @example
   * ```typescript
   * // In component cleanup or when observer is no longer needed
   * resizeObserver.destroy();
   *
   * // Observer can be reinitialized later if needed
   * resizeObserver.init();
   * ```
   */
  public destroy(): void {
    this.disconnectObserver()
    this.instance = null
  }

  /**
   * Creates a new ResizeObserver instance with comprehensive error handling.
   * Validates browser support and handles creation failures gracefully.
   *
   * @returns ResizeObserver instance or null if creation fails or is unavailable
   */
  private createResizeObserver(): ResizeObserver | null {
    // Environment check
    if (typeof window === 'undefined' || typeof ResizeObserver !== 'function') {
      console.warn('Resize: ResizeObserver is not available.')
      return null
    }

    try {
      return new ResizeObserver(this.handleResize)
    } catch (e) {
      console.error('Resize: Error creating ResizeObserver:', e)
      return null
    }
  }

  /**
   * Begins observing all valid HTML elements in the elements array.
   * Automatically filters out invalid elements using type checking.
   * Safely handles cases where the observer instance is not available.
   */
  private observeElements(): void {
    if (!this.instance) {
      return
    }

    for (let index = 0; index < this.elements.length; index++) {
      const element = this.elements[index]

      if (!isHTMLElement(element)) {
        continue
      }

      this.instance.observe(element)
    }
  }

  /**
   * Safely disconnects the ResizeObserver from all observed elements.
   * This stops all resize monitoring and clears the observer's internal state.
   */
  private disconnectObserver(): void {
    if (this.instance) {
      this.instance.disconnect()
    }
  }
}
