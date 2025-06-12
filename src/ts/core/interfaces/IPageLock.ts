/**
 * Configuration options for page locking functionality
 */
export interface IPageLockOptions {
  /**
   * Whether event listeners should be passive
   * @default false
   */
  passive?: boolean

  /**
   * Whether to lock keyboard navigation
   * @default true
   */
  lockKeyboard?: boolean
}

/**
 * Interface for page lock utility functions
 */
export interface IPageLock {
  /**
   * Locks or unlocks page scrolling and keyboard navigation
   * @param lock - Whether to lock (true) or unlock (false) the page
   * @param options - Configuration options for the lock behavior
   */
  (lock?: boolean, options?: IPageLockOptions): void
}

/**
 * Interface for prevent default utility functions
 */
export interface IPreventDefault {
  /**
   * Prevents default event behavior and stops propagation
   * @param event - The event to prevent (or event-like object with preventDefault and stopPropagation methods)
   */
  (event: { preventDefault(): void; stopPropagation(): void }): void
}

/**
 * Interface for keyboard prevention utility functions
 */
export interface IPreventKeyboard {
  /**
   * Prevents default behavior for specific keyboard events
   * @param event - The keyboard event to potentially prevent
   */
  (event: KeyboardEvent): void
}
