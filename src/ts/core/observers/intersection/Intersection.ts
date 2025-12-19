import type { IIntersection, IIntersectionCallbacks } from '../../interfaces'
import { isHTMLElement } from '../../dom'

/**
 * Advanced wrapper around the IntersectionObserver API that provides reliable element visibility
 * monitoring with comprehensive error handling and cross-browser compatibility.
 *
 * This class offers several advantages over direct IntersectionObserver usage:
 * - Automatic element validation and filtering
 * - Support for both immediate and debounced callbacks
 * - Separate callbacks for entering and leaving viewport
 * - Graceful degradation when IntersectionObserver is unavailable
 * - Clean lifecycle management with proper cleanup
 * - Environment checks for SSR compatibility
 * - Flexible threshold and root margin configuration
 *
 * Common use cases:
 * - Lazy loading of images, videos, and content
 * - Infinite scroll implementations
 * - Analytics and user engagement tracking
 * - Animation triggers based on viewport visibility
 * - Performance optimizations (pause/resume based on visibility)
 * - Ad impression tracking
 * - Progressive content loading
 *
 * @example
 * ```typescript
 * // Example 1: Basic lazy loading
 * const images = Array.from(document.querySelectorAll('img[data-src]'));
 * const lazyLoader = new Intersection({
 *   elements: images,
 *   callbackIntersect: (targets, entries) => {
 *     entries.forEach(entry => {
 *       if (entry.isIntersecting) {
 *         const img = entry.target as HTMLImageElement;
 *         img.src = img.dataset.src!;
 *         img.classList.add('loaded');
 *       }
 *     });
 *   },
 *   options: {
 *     rootMargin: '50px' // Start loading 50px before element enters viewport
 *   }
 * });
 *
 * // Example 2: Infinite scroll with separate callbacks
 * const loadTrigger = document.getElementById('load-more-trigger');
 * const infiniteScroll = new Intersection({
 *   elements: [loadTrigger],
 *   callbackIntersect: (targets, entries) => {
 *     // Element entered viewport - start loading
 *     showLoadingSpinner();
 *   },
 *   callbackIntersectDebounced: (targets, entries) => {
 *     // Debounced callback for actual loading
 *     loadMoreContent();
 *   },
 *   callbackOffIntersect: (targets, entries) => {
 *     // Element left viewport - cleanup if needed
 *     hideLoadingSpinner();
 *   }
 * });
 *
 * // Example 3: Animation triggers with threshold
 * const animatedElements = Array.from(document.querySelectorAll('.animate-on-scroll'));
 * const animationTrigger = new Intersection({
 *   elements: animatedElements,
 *   callbackIntersect: (targets, entries) => {
 *     entries.forEach(entry => {
 *       if (entry.isIntersecting) {
 *         entry.target.classList.add('animate-in');
 *       }
 *     });
 *   },
 *   callbackOffIntersect: (targets, entries) => {
 *     entries.forEach(entry => {
 *       if (!entry.isIntersecting) {
 *         entry.target.classList.remove('animate-in');
 *         entry.target.classList.add('animate-out');
 *       }
 *     });
 *   },
 *   options: {
 *     threshold: 0.1 // Trigger when 10% of element is visible
 *   }
 * });
 *
 * // Example 4: Video auto-play management
 * const videos = Array.from(document.querySelectorAll('video[autoplay]'));
 * const videoManager = new Intersection({
 *   elements: videos,
 *   callbackIntersect: (targets, entries) => {
 *     entries.forEach(entry => {
 *       if (entry.isIntersecting) {
 *         const video = entry.target as HTMLVideoElement;
 *         video.play().catch(console.error);
 *       }
 *     });
 *   },
 *   callbackOffIntersect: (targets, entries) => {
 *     entries.forEach(entry => {
 *       if (!entry.isIntersecting) {
 *         const video = entry.target as HTMLVideoElement;
 *         video.pause();
 *       }
 *     });
 *   },
 *   options: {
 *     threshold: 0.5 // 50% of video must be visible
 *   }
 * });
 *
 * // Example 5: Component lifecycle integration
 * class VisibilityTracker {
 *   private intersectionObserver: Intersection;
 *
 *   constructor(elements: HTMLElement[]) {
 *     this.intersectionObserver = new Intersection({
 *       elements,
 *       callbackIntersect: this.handleVisible.bind(this),
 *       callbackOffIntersect: this.handleHidden.bind(this)
 *     });
 *   }
 *
 *   destroy() {
 *     this.intersectionObserver.destroy(); // Clean up observers
 *   }
 *
 *   private handleVisible(targets: Element[], entries: IntersectionObserverEntry[]) {
 *     // Track when elements become visible
 *     this.trackVisibility(entries);
 *   }
 *
 *   private handleHidden(targets: Element[], entries: IntersectionObserverEntry[]) {
 *     // Track when elements become hidden
 *     this.trackHidden(entries);
 *   }
 * }
 * ```
 */
export class Intersection implements IIntersection {
  /** The IntersectionObserver instance, or null if unavailable/destroyed. */
  private instance: IntersectionObserver | null = null
  /** Array of HTML elements to observe for intersection changes. */
  private elements: Array<HTMLElement> = []
  /** Callbacks to execute on intersection events. */
  private callbacks: IIntersectionCallbacks
  /** IntersectionObserver configuration options. */
  private options: IntersectionObserverInit

  /**
   * Handles the IntersectionObserver callback with entry processing.
   * Separates intersecting and non-intersecting entries and calls appropriate callbacks.
   */
  private handleIntersection = (entries: Array<IntersectionObserverEntry>): void => {
    const intersectingTargets: Array<Element> = []
    const nonIntersectingTargets: Array<Element> = []
    const intersectingEntries: Array<IntersectionObserverEntry> = []
    const nonIntersectingEntries: Array<IntersectionObserverEntry> = []

    // Separate entries by intersection state
    for (const entry of entries) {
      if (entry.isIntersecting) {
        intersectingTargets.push(entry.target)
        intersectingEntries.push(entry)
      } else {
        nonIntersectingTargets.push(entry.target)
        nonIntersectingEntries.push(entry)
      }
    }

    // Call intersection callbacks
    if (intersectingEntries.length > 0) {
      if (this.callbacks.onIntersect) {
        this.callbacks.onIntersect(intersectingTargets, intersectingEntries)
      }

      if (this.callbacks.onIntersectDebounced) {
        this.callbacks.onIntersectDebounced(intersectingTargets, intersectingEntries)
      }
    }

    // Call non-intersection callbacks
    if (nonIntersectingEntries.length > 0) {
      if (this.callbacks.offIntersect) {
        this.callbacks.offIntersect(nonIntersectingTargets, nonIntersectingEntries)
      }

      if (this.callbacks.offIntersectDebounced) {
        this.callbacks.offIntersectDebounced(nonIntersectingTargets, nonIntersectingEntries)
      }
    }
  }

  /**
   * Creates a new Intersection observer instance and automatically initializes if valid elements and callbacks are provided.
   *
   * @param elements - Array of HTML elements to monitor for intersection changes
   * @param callbackIntersect - Immediate callback executed when elements enter viewport
   * @param callbackIntersectDebounced - Debounced callback for expensive operations on intersection
   * @param callbackOffIntersect - Immediate callback executed when elements leave viewport
   * @param callbackOffIntersectDebounced - Debounced callback for expensive operations when leaving viewport
   * @param options - IntersectionObserver configuration options (root, rootMargin, threshold)
   */
  constructor({
    elements,
    callbackIntersect,
    callbackIntersectDebounced,
    callbackOffIntersect,
    callbackOffIntersectDebounced,
    options = {}
  }: {
    elements: Array<HTMLElement>
    callbackIntersect?: IIntersectionCallbacks['onIntersect']
    callbackIntersectDebounced?: IIntersectionCallbacks['onIntersectDebounced']
    callbackOffIntersect?: IIntersectionCallbacks['offIntersect']
    callbackOffIntersectDebounced?: IIntersectionCallbacks['offIntersectDebounced']
    options?: IntersectionObserverInit
  }) {
    this.elements = elements
    this.options = options

    this.callbacks = {}
    if (callbackIntersect) {
      this.callbacks.onIntersect = callbackIntersect
    }
    if (callbackIntersectDebounced) {
      this.callbacks.onIntersectDebounced = callbackIntersectDebounced
    }
    if (callbackOffIntersect) {
      this.callbacks.offIntersect = callbackOffIntersect
    }
    if (callbackOffIntersectDebounced) {
      this.callbacks.offIntersectDebounced = callbackOffIntersectDebounced
    }

    if (this.elements.length && this.hasAnyCallbacks()) {
      this.init()
    }
  }

  /**
   * Initializes the IntersectionObserver and begins monitoring all specified elements.
   * Performs environment checks and prevents double initialization.
   *
   * @example
   * ```typescript
   * const observer = new Intersection({
   *   elements: [element],
   *   callbackIntersect: handleIntersection
   * });
   * // Observer automatically initializes in constructor
   *
   * // Or manually initialize later:
   * const observer = new Intersection({ elements: [] }); // No auto-init
   * observer.init(); // Manual initialization
   * ```
   */
  public init(): void {
    // Prevent re-initialization
    if (this.instance) {
      return
    }

    this.instance = this.createIntersectionObserver()

    // If instance is null (env check failed), don't proceed
    if (!this.instance) {
      return
    }

    this.observeElements()
  }

  /**
   * Completely disconnects the IntersectionObserver and cleans up all resources.
   * Call this method when the observer is no longer needed to prevent memory leaks.
   *
   * @example
   * ```typescript
   * // In component cleanup or when observer is no longer needed
   * intersectionObserver.destroy();
   *
   * // Observer can be reinitialized later if needed
   * intersectionObserver.init();
   * ```
   */
  public destroy(): void {
    this.disconnectObserver()
    this.instance = null
  }

  /**
   * Creates a new IntersectionObserver instance with comprehensive error handling.
   * Validates browser support and handles creation failures gracefully.
   *
   * @returns IntersectionObserver instance or null if creation fails or is unavailable
   */
  private createIntersectionObserver(): IntersectionObserver | null {
    // Environment check
    if (typeof window === 'undefined' || typeof IntersectionObserver !== 'function') {
      console.warn('Intersection: IntersectionObserver is not available.')
      return null
    }

    try {
      return new IntersectionObserver(this.handleIntersection, this.options)
    } catch (e) {
      console.error('Intersection: Error creating IntersectionObserver:', e)
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
   * Safely disconnects the IntersectionObserver from all observed elements.
   * This stops all intersection monitoring and clears the observer's internal state.
   */
  private disconnectObserver(): void {
    if (this.instance) {
      this.instance.disconnect()
    }
  }

  /**
   * Checks if any callbacks are defined to determine if initialization should proceed.
   * Prevents unnecessary initialization when no callbacks are provided.
   *
   * @returns true if at least one callback is defined
   */
  private hasAnyCallbacks(): boolean {
    return !!(
      this.callbacks.onIntersect ||
      this.callbacks.onIntersectDebounced ||
      this.callbacks.offIntersect ||
      this.callbacks.offIntersectDebounced
    )
  }
}
