export interface IResize {
  /**
   * Initializes the ResizeObserver and starts observing elements.
   */
  init(): void

  /**
   * Disconnects the ResizeObserver and cleans up the instance.
   */
  destroy(): void
}

export interface IResizeCallbacks {
  /**
   * Callback function executed when elements are resized.
   */
  onResize?: (targets: Array<Element>, entries: Array<ResizeObserverEntry>) => void
  /**
   * Debounced callback function executed when elements are resized.
   */
  onResizeDebounced?: (targets: Array<Element>, entries: Array<ResizeObserverEntry>) => void
}
