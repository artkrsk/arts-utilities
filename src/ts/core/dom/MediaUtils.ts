import type { ILoadMediaOptions } from '../interfaces'

/**
 * Loads a media element (image or video) and resolves when ready.
 * Handles different media types and optimizes loading performance by setting appropriate attributes.
 *
 * @param element - The media element to load (img, video, or other HTML element)
 * @param options - Configuration options for loading behavior
 * @returns Promise that resolves with the element when loaded, or rejects on timeout/error
 *
 * @example
 * ```typescript
 * // Example 1: Load an image with default settings
 * const img = document.querySelector('img');
 * try {
 *   const loadedImg = await loadMedia(img);
 *   console.log('Image loaded successfully', loadedImg);
 * } catch (error) {
 *   console.error('Failed to load image:', error);
 * }
 *
 * // Example 2: Load with custom timeout
 * try {
 *   const video = await loadMedia(videoElement, { timeout: 5000 });
 *   console.log('Video loaded within 5 seconds');
 * } catch (error) {
 *   console.error('Video took too long to load');
 * }
 *
 * // Example 3: Load without priority attributes
 * const media = await loadMedia(element, {
 *   setPriority: false,
 *   timeout: 15000
 * });
 *
 * // Example 4: Batch load multiple media elements
 * const mediaElements = document.querySelectorAll('img, video');
 * const loadPromises = Array.from(mediaElements).map(el => loadMedia(el));
 * const loadedElements = await Promise.allSettled(loadPromises);
 * ```
 */
export const loadMedia = async (
  element: HTMLElement | null,
  options: ILoadMediaOptions = {}
): Promise<HTMLElement> => {
  const { timeout = 10000, setPriority = true } = options

  if (!element) {
    throw new Error('Element is required for media loading')
  }

  return new Promise((resolve, reject) => {
    let timeoutId: NodeJS.Timeout | null = null

    // Set up timeout if specified
    if (timeout > 0) {
      timeoutId = setTimeout(() => {
        reject(new Error(`Media loading timed out after ${timeout}ms`))
      }, timeout)
    }

    const resolveWithCleanup = (result: HTMLElement): void => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      resolve(result)
    }

    const rejectWithCleanup = (error: Error): void => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      reject(error)
    }

    const tagName = element.tagName?.toUpperCase()

    if (tagName === 'IMG') {
      const imgElement = element as HTMLImageElement

      // Check if image is already loaded
      if (imgElement.complete && imgElement.naturalWidth > 0) {
        resolveWithCleanup(imgElement)
        return
      }

      // Set priority attributes for faster loading if enabled
      if (setPriority) {
        imgElement.setAttribute('loading', 'eager')
        imgElement.setAttribute('decoding', 'sync')
        imgElement.setAttribute('fetchpriority', 'high')
      }

      // Set up event listeners
      const handleLoad = (): void => {
        imgElement.removeEventListener('load', handleLoad)
        imgElement.removeEventListener('error', handleError)
        resolveWithCleanup(imgElement)
      }

      const handleError = (_event: Event): void => {
        imgElement.removeEventListener('load', handleLoad)
        imgElement.removeEventListener('error', handleError)
        rejectWithCleanup(new Error(`Image failed to load: ${imgElement.src || 'unknown source'}`))
      }

      imgElement.addEventListener('load', handleLoad)
      imgElement.addEventListener('error', handleError)

      // Trigger loading if src is already set but not loaded
      if (imgElement.src && !imgElement.complete) {
        // Force reload by temporarily changing src
        const originalSrc = imgElement.src
        imgElement.src = ''
        imgElement.src = originalSrc
      }
    } else if (tagName === 'VIDEO') {
      const videoElement = element as HTMLVideoElement

      // Check if video is already ready
      if (videoElement.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        resolveWithCleanup(videoElement)
        return
      }

      // Set up event listeners
      const handleCanPlay = (): void => {
        videoElement.removeEventListener('canplaythrough', handleCanPlay)
        videoElement.removeEventListener('error', handleError)
        resolveWithCleanup(videoElement)
      }

      const handleError = (_event: Event): void => {
        videoElement.removeEventListener('canplaythrough', handleCanPlay)
        videoElement.removeEventListener('error', handleError)
        rejectWithCleanup(
          new Error(`Video failed to load: ${videoElement.src || 'unknown source'}`)
        )
      }

      videoElement.addEventListener('canplaythrough', handleCanPlay)
      videoElement.addEventListener('error', handleError)

      // Set priority attributes for faster loading if enabled
      if (setPriority) {
        videoElement.setAttribute('preload', 'auto')
      }

      // Trigger loading if needed
      if (videoElement.networkState === HTMLMediaElement.NETWORK_IDLE) {
        videoElement.load()
      }
    } else {
      // For non-media elements, resolve immediately
      resolveWithCleanup(element)
    }
  })
}
