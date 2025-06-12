/**
 * Callback function type for responsive resize events.
 * Executed when viewport dimensions change based on device capabilities and interaction methods.
 *
 * @example
 * ```typescript
 * // Simple viewport change handler
 * const handleResize: TResponsiveResizeCallback = () => {
 *   console.log('Viewport changed:', window.innerWidth, window.innerHeight);
 * };
 *
 * // Complex layout adjustment handler
 * const adjustLayout: TResponsiveResizeCallback = () => {
 *   const isDesktop = window.innerWidth >= 1024;
 *   const isMobile = window.innerWidth < 768;
 *
 *   if (isDesktop) {
 *     enableDesktopFeatures();
 *   } else if (isMobile) {
 *     enableMobileFeatures();
 *   } else {
 *     enableTabletFeatures();
 *   }
 * };
 * ```
 */
export type TResponsiveResizeCallback = () => void

/**
 * Configuration options for the responsive resize utility with behavior control.
 * Provides fine-grained control over callback execution and initialization timing.
 *
 * @example
 * ```typescript
 * // Immediate execution for critical layout setup
 * const immediateOptions: IResponsiveResizeOptions = {
 *   callback: setupCriticalLayout,
 *   immediateCall: true   // Execute on attach
 * };
 *
 * // Deferred execution for non-critical features
 * const deferredOptions: IResponsiveResizeOptions = {
 *   callback: setupAnimations,
 *   immediateCall: false  // Wait for first resize
 * };
 * ```
 */
export interface IResponsiveResizeOptions {
  /**
   * Callback function to execute when viewport changes are detected.
   * Should handle responsive adjustments, layout changes, or feature toggles
   * based on the new viewport dimensions and device capabilities.
   *
   * @example
   * ```typescript
   * callback: () => {
   *   // Responsive navigation
   *   const nav = document.querySelector('.navigation');
   *   const isMobile = window.innerWidth < 768;
   *   nav.classList.toggle('mobile-nav', isMobile);
   *
   *   // Image loading strategy
   *   updateImageSources(isMobile ? 'mobile' : 'desktop');
   *
   *   // Feature availability
   *   toggleAdvancedFeatures(!isMobile);
   * }
   * ```
   */
  callback: TResponsiveResizeCallback

  /**
   * Whether to call the callback immediately upon attachment.
   * When true, executes the callback once during setup to establish initial state.
   * When false, waits for the first actual viewport change before executing.
   *
   * @default true
   *
   * @example
   * ```typescript
   * // Immediate call for initial setup
   * immediateCall: true   // Establishes correct initial state
   *
   * // Deferred call for change-only handling
   * immediateCall: false  // Only responds to actual changes
   *
   * // Conditional immediate call
   * immediateCall: !isInitialSetupComplete()
   * ```
   */
  immediateCall?: boolean
}

/**
 * Cleanup object returned by responsive resize attachment with resource management.
 * Provides a clean interface for removing event listeners and preventing memory leaks.
 *
 * @example
 * ```typescript
 * // Component lifecycle integration
 * const cleanup = attachResponsiveResize(handleResize);
 *
 * // React useEffect cleanup
 * useEffect(() => {
 *   const cleanup = attachResponsiveResize(handleViewportChange);
 *   return () => cleanup.clear();
 * }, []);
 *
 * // Manual cleanup on route change
 * router.beforeEach(() => {
 *   resizeCleanup.clear();
 * });
 * ```
 */
export interface IResponsiveResizeCleanup {
  /**
   * Removes all event listeners and cleans up associated resources.
   * Should be called when the component or feature is no longer needed
   * to prevent memory leaks and unnecessary callback executions.
   *
   * @example
   * ```typescript
   * // Component unmount cleanup
   * componentWillUnmount() {
   *   this.resizeCleanup.clear();
   * }
   *
   * // Conditional cleanup
   * if (featureIsDisabled) {
   *   resizeCleanup.clear();
   * }
   *
   * // Route-based cleanup
   * router.beforeEach(() => {
   *   currentPageCleanup?.clear();
   * });
   * ```
   */
  clear: () => void
}

/**
 * Interface for the responsive resize utility function providing intelligent viewport change detection.
 * Handles viewport changes differently based on device capabilities, distinguishing between
 * pointer-based devices (desktop/laptop) and touch-based devices (mobile/tablet) for optimal performance.
 *
 * The utility automatically determines the appropriate resize handling strategy:
 * - Desktop/pointer devices: Uses resize events with debouncing
 * - Mobile/touch devices: Uses orientationchange events and media query listeners
 *
 * @example
 * ```typescript
 * // Basic responsive layout handling
 * const cleanup = responsiveResize(() => {
 *   const breakpoint = window.innerWidth >= 768 ? 'desktop' : 'mobile';
 *   updateLayoutForBreakpoint(breakpoint);
 * });
 *
 * // Advanced responsive feature management
 * const handleResponsiveChanges = () => {
 *   const width = window.innerWidth;
 *   const height = window.innerHeight;
 *
 *   // Update CSS custom properties
 *   document.documentElement.style.setProperty('--viewport-width', `${width}px`);
 *   document.documentElement.style.setProperty('--viewport-height', `${height}px`);
 *
 *   // Toggle features based on viewport
 *   toggleParallaxEffects(width >= 1024);
 *   toggleAnimations(width >= 768);
 *   updateImageSizes(width);
 * };
 *
 * const cleanup = responsiveResize(handleResponsiveChanges, true);
 *
 * // React component integration
 * function ResponsiveComponent() {
 *   const [viewport, setViewport] = useState('desktop');
 *
 *   useEffect(() => {
 *     const updateViewport = () => {
 *       setViewport(window.innerWidth >= 768 ? 'desktop' : 'mobile');
 *     };
 *
 *     const cleanup = responsiveResize(updateViewport);
 *     return () => cleanup.clear();
 *   }, []);
 *
 *   return <div className={`component--${viewport}`}>Content</div>;
 * }
 *
 * // Vue component integration
 * export default {
 *   mounted() {
 *     this.resizeCleanup = responsiveResize(() => {
 *       this.isMobile = window.innerWidth < 768;
 *     });
 *   },
 *   beforeUnmount() {
 *     this.resizeCleanup?.clear();
 *   }
 * };
 * ```
 */
export interface IResponsiveResize {
  /**
   * Attaches intelligent responsive resize listeners that adapt behavior based on device capabilities.
   * Automatically selects the most appropriate event handling strategy for the current device type,
   * providing optimal performance and battery life across different platforms.
   *
   * @param callback - Function to execute when viewport dimensions change
   * @param immediateCall - Whether to execute callback immediately upon attachment (default: true)
   * @returns Cleanup object with clear function for removing listeners
   *
   * @example
   * ```typescript
   * // Simple responsive navigation
   * const navCleanup = responsiveResize(() => {
   *   const nav = document.querySelector('.navigation');
   *   const isMobile = window.innerWidth < 768;
   *   nav.classList.toggle('mobile-nav', isMobile);
   * });
   *
   * // Responsive image loading
   * const imageCleanup = responsiveResize(() => {
   *   const images = document.querySelectorAll('img[data-responsive]');
   *   const density = window.devicePixelRatio >= 2 ? '2x' : '1x';
   *   const size = window.innerWidth >= 1200 ? 'large' : 'medium';
   *
   *   images.forEach(img => {
   *     const baseSrc = img.dataset.src;
   *     img.src = `${baseSrc}_${size}_${density}.jpg`;
   *   });
   * }, false); // Don't call immediately, wait for actual changes
   *
   * // Performance monitoring
   * const perfCleanup = responsiveResize(() => {
   *   const isSmallViewport = window.innerWidth < 600;
   *
   *   // Disable expensive features on small viewports
   *   toggleParticleEffects(!isSmallViewport);
   *   toggleVideoBackgrounds(!isSmallViewport);
   *
   *   // Adjust animation performance
   *   document.documentElement.style.setProperty(
   *     '--animation-duration',
   *     isSmallViewport ? '0.2s' : '0.4s'
   *   );
   * });
   *
   * // Cleanup all listeners when needed
   * function cleanupAllResizeListeners() {
   *   navCleanup.clear();
   *   imageCleanup.clear();
   *   perfCleanup.clear();
   * }
   * ```
   */
  (callback: TResponsiveResizeCallback, immediateCall?: boolean): IResponsiveResizeCleanup
}
