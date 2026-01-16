/**
 * Configuration options for page locking functionality with fine-grained control.
 * Provides flexible control over event handling behavior and accessibility features.
 *
 * @example
 * ```typescript
 * // Performance-optimized locking for frequent toggles
 * const fastLockOptions: IPageLockOptions = {
 *   passive: true,        // Better scroll performance
 *   lockKeyboard: false   // Allow keyboard navigation
 * };
 *
 * // Complete page lock for modals
 * const modalLockOptions: IPageLockOptions = {
 *   passive: false,       // Ensure preventDefault works
 *   lockKeyboard: true    // Block all navigation keys
 * };
 *
 * // Accessibility-friendly locking
 * const a11yLockOptions: IPageLockOptions = {
 *   passive: false,
 *   lockKeyboard: false   // Keep keyboard navigation for screen readers
 * };
 * ```
 */
export interface IPageLockOptions {
  /**
   * Whether event listeners should be passive for better performance.
   * Passive listeners cannot call preventDefault(), improving scroll performance
   * but reducing control over event handling. Use false when precise control is needed.
   *
   * @default false
   *
   * @example
   * ```typescript
   * // High-performance scrolling (passive: true)
   * passive: true   // Cannot preventDefault, better performance
   *
   * // Full control over events (passive: false)
   * passive: false  // Can preventDefault, more control
   *
   * // Conditional based on device capabilities
   * passive: isMobileDevice() // Use passive on mobile for performance
   * ```
   */
  passive?: boolean

  /**
   * Whether to lock keyboard navigation keys that can cause scrolling.
   * When true, prevents Space, Page Up/Down, Home, End, and arrow keys.
   * When false, allows keyboard navigation for accessibility.
   *
   * @default true
   *
   * @example
   * ```typescript
   * // Full keyboard locking for immersive experiences
   * lockKeyboard: true    // Block all navigation keys
   *
   * // Accessibility-friendly locking
   * lockKeyboard: false   // Allow keyboard navigation
   *
   * // Conditional based on user preferences
   * lockKeyboard: !userPreferences.keyboardNavigation
   * ```
   */
  lockKeyboard?: boolean

  /**
   * Whether to allow nested scrollable elements to scroll while keeping the page locked.
   * When true, uses smart scroll prevention that detects scrollable containers and allows
   * them to scroll if they haven't reached their scroll boundaries. The page remains locked.
   * When false, blocks all scrolling including nested elements.
   *
   * @default false
   *
   * @example
   * ```typescript
   * // Modal with scrollable content
   * pageLock(true, {
   *   allowNestedScroll: true  // Modal content can scroll, page stays locked
   * });
   *
   * // Fullscreen overlay - block everything
   * pageLock(true, {
   *   allowNestedScroll: false // Nothing can scroll
   * });
   *
   * // Sidebar with scrollable content
   * pageLock(true, {
   *   passive: false,
   *   allowNestedScroll: true,
   *   lockKeyboard: false
   * });
   * ```
   */
  allowNestedScroll?: boolean
}

/**
 * Interface for page lock utility functions providing comprehensive scroll and navigation control.
 * Enables temporary prevention of page scrolling and keyboard navigation for modal dialogs,
 * overlays, fullscreen experiences, and other UI states requiring focus containment.
 *
 * @example
 * ```typescript
 * // Modal dialog implementation
 * function openModal() {
 *   pageLock(true);  // Lock page when modal opens
 *   modal.classList.add('visible');
 *   modal.focus();
 * }
 *
 * function closeModal() {
 *   pageLock(false); // Unlock page when modal closes
 *   modal.classList.remove('visible');
 *   previousFocus.focus();
 * }
 *
 * // Fullscreen image viewer
 * function enterFullscreen() {
 *   pageLock(true, {
 *     passive: false,
 *     lockKeyboard: true
 *   });
 *   viewer.classList.add('fullscreen');
 * }
 *
 * // Loading overlay with accessibility
 * function showLoading() {
 *   pageLock(true, {
 *     passive: false,
 *     lockKeyboard: false  // Keep keyboard accessible
 *   });
 * }
 * ```
 */
export interface IPageLock {
  /**
   * Locks or unlocks page scrolling and keyboard navigation with configurable behavior.
   * Provides centralized control over page interaction states, ensuring consistent
   * behavior across different UI components and accessibility requirements.
   *
   * @param lock - Whether to lock (true) or unlock (false) the page. Defaults to toggle behavior when undefined
   * @param options - Configuration options for lock behavior and performance characteristics
   *
   * @example
   * ```typescript
   * // Simple toggle behavior
   * pageLock();           // Toggles current lock state
   *
   * // Explicit locking
   * pageLock(true);       // Always lock
   * pageLock(false);      // Always unlock
   *
   * // Modal with full lock
   * pageLock(true, {
   *   passive: false,     // Full event control
   *   lockKeyboard: true  // Block navigation keys
   * });
   *
   * // Overlay with keyboard access
   * pageLock(true, {
   *   passive: false,
   *   lockKeyboard: false // Allow keyboard navigation
   * });
   *
   * // Performance-optimized for frequent calls
   * pageLock(true, {
   *   passive: true,      // Better performance
   *   lockKeyboard: false
   * });
   *
   * // Conditional locking based on state
   * const shouldLock = modal.classList.contains('visible');
   * pageLock(shouldLock);
   *
   * // Cleanup on component unmount
   * useEffect(() => {
   *   return () => pageLock(false); // Always unlock on cleanup
   * }, []);
   * ```
   */
  (lock?: boolean, options?: IPageLockOptions): void
}

/**
 * Interface for prevent default utility functions providing safe event prevention.
 * Offers robust event handling with error recovery for various event-like objects.
 *
 * @example
 * ```typescript
 * // Standard event prevention
 * document.addEventListener('click', (event) => {
 *   if (shouldPreventClick(event.target)) {
 *     preventDefault(event);
 *   }
 * });
 *
 * // Custom event-like objects
 * const customEvent = {
 *   preventDefault: () => console.log('Default prevented'),
 *   stopPropagation: () => console.log('Propagation stopped')
 * };
 * preventDefault(customEvent);
 * ```
 */
export interface IPreventDefault {
  /**
   * Prevents default event behavior and stops propagation with error handling.
   * Safely handles both standard events and custom event-like objects,
   * ensuring robust operation even when methods throw exceptions.
   *
   * @param event - The event or event-like object with preventDefault and stopPropagation methods
   *
   * @example
   * ```typescript
   * // Form submission prevention
   * form.addEventListener('submit', (event) => {
   *   if (!isValid) {
   *     preventDefault(event);
   *     showValidationErrors();
   *   }
   * });
   *
   * // Link click prevention
   * link.addEventListener('click', (event) => {
   *   preventDefault(event);
   *   handleCustomNavigation();
   * });
   *
   * // Touch event prevention
   * element.addEventListener('touchstart', (event) => {
   *   preventDefault(event); // Prevent scrolling
   * });
   * ```
   */
  (event: { preventDefault(): void; stopPropagation(): void }): void
}

/**
 * Interface for keyboard prevention utility functions providing selective key blocking.
 * Prevents specific keyboard events that can cause unwanted navigation or scrolling.
 *
 * @example
 * ```typescript
 * // Modal keyboard handling
 * document.addEventListener('keydown', (event) => {
 *   if (modalIsOpen) {
 *     preventKeyboard(event); // Block navigation keys
 *   }
 * });
 *
 * // Game input handling
 * canvas.addEventListener('keydown', (event) => {
 *   preventKeyboard(event); // Prevent arrow keys from scrolling
 *   handleGameInput(event);
 * });
 * ```
 */
export interface IPreventKeyboard {
  /**
   * Prevents default behavior for specific keyboard events that cause navigation.
   * Selectively blocks Space, Page Up/Down, Home, End, and arrow keys while
   * allowing other keyboard functionality to continue normally.
   *
   * @param event - The keyboard event to potentially prevent
   *
   * @example
   * ```typescript
   * // Fullscreen viewer keyboard handling
   * document.addEventListener('keydown', (event) => {
   *   if (isFullscreenMode) {
   *     preventKeyboard(event); // Block scrolling keys
   *
   *     // Handle custom shortcuts
   *     if (event.key === 'Escape') {
   *       exitFullscreen();
   *     }
   *   }
   * });
   *
   * // Custom scrollable component
   * customScroller.addEventListener('keydown', (event) => {
   *   preventKeyboard(event); // Prevent page scrolling
   *   handleCustomScrolling(event);
   * });
   *
   * // Modal with custom keyboard handling
   * modal.addEventListener('keydown', (event) => {
   *   preventKeyboard(event); // Block background scrolling
   *
   *   // Allow modal-specific keys
   *   if (event.key === 'Tab') {
   *     handleTabNavigation(event);
   *   }
   * });
   * ```
   */
  (event: KeyboardEvent): void
}
