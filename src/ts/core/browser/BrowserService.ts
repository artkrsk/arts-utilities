import type { IBrowserService } from '../interfaces'

/**
 * Service for browser operations
 */
class BrowserServiceClass {
  /**
   * Check if a media query matches
   * @param query Media query string
   * @returns True if the query matches
   */
  static matchMedia(query: string): boolean {
    try {
      return window.matchMedia(query).matches
    } catch (_error) {
      return false
    }
  }

  /**
   * Get current viewport width
   * @returns Viewport width in pixels
   */
  static getViewportWidth(): number {
    try {
      return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    } catch (_error) {
      return 0
    }
  }

  /**
   * Get current viewport height
   * @returns Viewport height in pixels
   */
  static getViewportHeight(): number {
    try {
      return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    } catch (_error) {
      return 0
    }
  }

  /**
   * Check if the page is loaded in an iframe
   * @returns True if the page is loaded in an iframe
   */
  static isInIframe(): boolean {
    try {
      return window.self !== window.top
    } catch (_error) {
      // If we can't access window.top due to same-origin policy,
      // we're definitely in an iframe
      return true
    }
  }
}

export const BrowserService: IBrowserService = {
  matchMedia: BrowserServiceClass.matchMedia,
  getViewportWidth: BrowserServiceClass.getViewportWidth,
  getViewportHeight: BrowserServiceClass.getViewportHeight,
  isInIframe: BrowserServiceClass.isInIframe
}
