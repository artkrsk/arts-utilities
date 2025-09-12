import type { IDOMMediaService } from '../interfaces/IDOMMediaService'

/**
 * Service for DOM media operations, providing consistent video/audio control and iframe communication.
 * Implements null safety, error handling, and proper async/await patterns for media operations.
 */
class DOMMediaServiceClass {
  /**
   * Plays a video element with proper error handling and promise support.
   * Handles the asynchronous nature of video.play() and provides fallback for unsupported elements.
   *
   * @param video HTMLVideoElement to play
   * @returns Promise that resolves when video starts playing or immediately if element is invalid
   */
  public static playVideo(video: HTMLVideoElement): Promise<void> {
    try {
      if (!video) {
        return Promise.resolve()
      }

      if (typeof video.play !== 'function') {
        return Promise.resolve()
      }

      const playPromise = video.play()

      // video.play() returns a Promise in modern browsers, but may return undefined in older ones
      if (playPromise && typeof playPromise.then === 'function') {
        return playPromise.catch(() => {
          // Silently handle play failures (e.g., user interaction required)
          return Promise.resolve()
        })
      }

      return Promise.resolve()
    } catch (error) {
      // Handle any synchronous errors
      return Promise.resolve()
    }
  }

  /**
   * Pauses a video element with null safety and error handling.
   * Provides consistent behavior across different video states and element types.
   *
   * @param video HTMLVideoElement to pause
   */
  public static pauseVideo(video: HTMLVideoElement): void {
    try {
      if (!video) {
        return
      }

      if (typeof video.pause !== 'function') {
        return
      }

      video.pause()
    } catch (error) {
      // Silently handle pause failures
      return
    }
  }

  /**
   * Sends a message to an iframe's content window with origin validation support.
   * Enables secure communication with embedded content like YouTube players or custom widgets.
   *
   * @param iframe HTMLIFrameElement to send message to
   * @param message Message string to send (typically JSON.stringify'd object)
   * @param targetOrigin Target origin for security (defaults to '*' for any origin)
   */
  public static postMessageToIframe(
    iframe: HTMLIFrameElement,
    message: string,
    targetOrigin: string = '*'
  ): void {
    try {
      if (!iframe) {
        return
      }

      if (!iframe.contentWindow) {
        return
      }

      if (!message) {
        return
      }

      iframe.contentWindow.postMessage(message, targetOrigin)
    } catch (error) {
      // Silently handle postMessage failures (e.g., cross-origin issues)
      return
    }
  }
}

/**
 * Exported DOMMediaService instance implementing IDOMMediaService interface.
 * Provides static methods for media operations with consistent error handling.
 */
export const DOMMediaService: IDOMMediaService = {
  playVideo: DOMMediaServiceClass.playVideo,
  pauseVideo: DOMMediaServiceClass.pauseVideo,
  postMessageToIframe: DOMMediaServiceClass.postMessageToIframe
}
