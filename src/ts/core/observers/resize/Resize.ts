import type { IResize, IResizeCallbacks } from '../../interfaces'

/**
 * Wraps the ResizeObserver API to execute callbacks when elements are resized.
 */
export class Resize implements IResize {
  /** The ResizeObserver instance, or null if unavailable/destroyed. */
  private instance: ResizeObserver | null = null
  /** Array of HTML elements to observe for resize changes. */
  private elements: Array<HTMLElement> = []
  /** Callbacks to execute on resize events. */
  private callbacks: IResizeCallbacks

  /** Handles the resize observer change event. */
  private handleResize = (entries: Array<ResizeObserverEntry>) => {
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
   * Creates a Resize instance.
   * @param elements - Array of HTML elements to observe for resize changes.
   * @param callbackResize - Function to call when elements are resized.
   * @param callbackResizeDebounced - Debounced function to call when elements are resized.
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
   * Initializes the ResizeObserver and starts observing elements.
   */
  public init() {
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
   * Disconnects the ResizeObserver and cleans up the instance.
   */
  public destroy() {
    this.disconnectObserver()
    this.instance = null
  }

  /**
   * Creates and returns a ResizeObserver instance, or null if unavailable.
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
   * Starts observing all valid elements for resize changes.
   */
  private observeElements() {
    if (!this.instance) {
      return
    }

    for (let index = 0; index < this.elements.length; index++) {
      const element = this.elements[index]

      if (!element || !(element instanceof HTMLElement)) {
        continue
      }

      this.instance.observe(element)
    }
  }

  /**
   * Disconnects the ResizeObserver from all observed elements.
   */
  private disconnectObserver() {
    if (this.instance) {
      this.instance.disconnect()
    }
  }
}
