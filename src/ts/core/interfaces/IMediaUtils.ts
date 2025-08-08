import type { TMediaType, TVideoEmbedOptions } from '../types'

/**
 * Configuration options for media loading behavior with performance and reliability controls.
 * Provides fine-grained control over media loading timeouts and optimization strategies.
 *
 * @example
 * ```typescript
 * // Fast loading for critical above-the-fold images
 * const criticalOptions: ILoadMediaOptions = {
 *   timeout: 5000,      // Quick timeout
 *   setPriority: true   // Enable priority hints
 * };
 *
 * // Patient loading for background media
 * const backgroundOptions: ILoadMediaOptions = {
 *   timeout: 30000,     // Extended timeout
 *   setPriority: false  // No priority optimization
 * };
 *
 * // Mobile-optimized loading
 * const mobileOptions: ILoadMediaOptions = {
 *   timeout: 15000,
 *   setPriority: window.innerWidth < 768 // Priority only on mobile
 * };
 * ```
 */
export interface ILoadMediaOptions {
  /**
   * Timeout in milliseconds for media loading operations.
   * Prevents indefinite loading states and provides fallback opportunities.
   * Consider network conditions and media size when setting timeout values.
   *
   * @default 10000
   *
   * @example
   * ```typescript
   * // Quick timeout for thumbnails
   * timeout: 3000
   *
   * // Standard timeout for images
   * timeout: 10000   // Default value
   *
   * // Extended timeout for large videos
   * timeout: 30000
   *
   * // No timeout (use with caution)
   * timeout: 0
   * ```
   */
  timeout?: number

  /**
   * Whether to set priority attributes for faster loading.
   * Enables browser optimization hints like 'fetchpriority' and 'loading' attributes
   * to improve Core Web Vitals and user experience.
   *
   * @default true
   *
   * @example
   * ```typescript
   * // Enable priority for hero images
   * setPriority: true    // Sets fetchpriority="high"
   *
   * // Disable priority for lazy-loaded content
   * setPriority: false   // No priority attributes
   *
   * // Conditional priority based on viewport
   * setPriority: isAboveFold(element)
   * ```
   */
  setPriority?: boolean
}

/**
 * Interface for media utility functions providing robust media loading with timeout and optimization.
 * Handles various media types including images and videos with comprehensive error handling,
 * performance optimization, and cross-browser compatibility.
 *
 * @example
 * ```typescript
 * // Progressive image loading with fallback
 * const loadImageWithFallback = async (img: HTMLImageElement) => {
 *   try {
 *     await mediaUtils.loadMedia(img, { timeout: 5000, setPriority: true });
 *     img.classList.add('loaded');
 *   } catch (error) {
 *     img.src = '/images/placeholder.jpg'; // Fallback image
 *     console.warn('Failed to load image:', error);
 *   }
 * };
 *
 * // Lazy loading implementation
 * const observer = new IntersectionObserver(async (entries) => {
 *   for (const entry of entries) {
 *     if (entry.isIntersecting) {
 *       const img = entry.target as HTMLImageElement;
 *       try {
 *         await mediaUtils.loadMedia(img, { setPriority: false });
 *         observer.unobserve(img);
 *       } catch (error) {
 *         img.style.display = 'none'; // Hide failed images
 *       }
 *     }
 *   }
 * });
 *
 * // Video preloading
 * const preloadVideo = async (video: HTMLVideoElement) => {
 *   try {
 *     await mediaUtils.loadMedia(video, { timeout: 15000 });
 *     video.play();
 *   } catch (error) {
 *     showVideoUnavailableMessage();
 *   }
 * };
 * ```
 */
export interface IMediaUtils {
  /**
   * Loads a media element (image or video) and resolves when ready for display.
   * Provides robust loading with timeout handling, priority optimization, and
   * comprehensive error management for various media types.
   *
   * @param element - The media element to load (img, video, or other media element)
   * @param options - Configuration options for loading behavior and optimization
   * @returns Promise that resolves with the loaded element, or rejects on timeout/error
   *
   * @example
   * ```typescript
   * // Basic image loading
   * const img = document.createElement('img');
   * img.src = '/images/hero.jpg';
   *
   * try {
   *   const loadedImg = await mediaUtils.loadMedia(img);
   *   document.body.appendChild(loadedImg);
   * } catch (error) {
   *   console.error('Failed to load image:', error);
   * }
   *
   * // High-priority hero image loading
   * const heroImage = document.querySelector('.hero-image') as HTMLImageElement;
   * await mediaUtils.loadMedia(heroImage, {
   *   timeout: 5000,      // Quick timeout for critical content
   *   setPriority: true   // Enable browser optimization
   * });
   * heroImage.classList.add('loaded');
   *
   * // Video loading with extended timeout
   * const video = document.querySelector('video') as HTMLVideoElement;
   * try {
   *   await mediaUtils.loadMedia(video, {
   *     timeout: 20000,     // Extended timeout for video
   *     setPriority: false  // No priority for background video
   *   });
   *   video.play();
   * } catch (error) {
   *   video.poster = '/images/video-placeholder.jpg';
   *   showPlayButton();
   * }
   *
   * // Batch loading with Promise.all
   * const images = document.querySelectorAll('img[data-src]');
   * const loadPromises = Array.from(images).map(async (img) => {
   *   img.src = img.dataset.src;
   *   return mediaUtils.loadMedia(img, { timeout: 8000 });
   * });
   *
   * const results = await Promise.allSettled(loadPromises);
   * const failed = results.filter(r => r.status === 'rejected').length;
   * console.log(`Loaded ${results.length - failed}/${results.length} images`);
   *
   * // Safe loading with null handling
   * const optionalImage = document.querySelector('.optional-image') as HTMLImageElement | null;
   * if (optionalImage) {
   *   try {
   *     await mediaUtils.loadMedia(optionalImage);
   *   } catch (error) {
   *     // Handle loading failure gracefully
   *   }
   * }
   * ```
   */
  loadMedia: (element: HTMLElement | null, options?: ILoadMediaOptions) => Promise<HTMLElement>
}

// Media Detection and Video URL Processing Interfaces

/**
 * Function signature for detecting media type from file URL extensions.
 * Analyzes URL pathname to determine if it's an image, video, or unknown file type.
 *
 * @param url - The file URL to analyze
 * @returns The detected media type or null if unknown/invalid
 */
export interface IGetMediaType {
  (url: string): TMediaType
}

/**
 * Function signature for comprehensive media detection including streaming platforms.
 * Checks URL patterns for streaming services first, then falls back to file extension detection.
 *
 * @param url - The URL to analyze
 * @returns The detected media type or null if unknown/invalid
 */
export interface IDetectMediaFromURL {
  (url: string): TMediaType
}

/**
 * Function signature for extracting video IDs from streaming platform URLs.
 * Parses YouTube and Vimeo URLs to extract the unique video identifier.
 *
 * @param url - The video URL to extract ID from
 * @returns The extracted video ID or null if not found/unsupported
 */
export interface IExtractVideoID {
  (url: string): string | null
}

/**
 * Function signature for generating embed URLs for video platforms.
 * Converts regular video URLs to their embeddable equivalents with optional parameters.
 *
 * @param url - The original video URL
 * @param options - Embed configuration options
 * @returns The embed URL or original URL if not a supported video platform
 */
export interface IGenerateEmbedURL {
  (url: string, options?: TVideoEmbedOptions): string
}
