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
   * Get the current user agent
   * @returns The user agent string
   */
  static getUserAgent(): string {
    try {
      return navigator.userAgent
    } catch (_error) {
      return ''
    }
  }

  /**
   * Check if the browser supports a specific feature
   * @param featureName The name of the feature to check
   * @returns True if the feature is supported
   */
  static supportsFeature(featureName: string): boolean {
    try {
      // Check for CSS features
      if (featureName.startsWith('css-')) {
        const cssFeature = featureName.substring(4)
        return CSS.supports(cssFeature)
      }

      // Handle specific feature cases
      switch (featureName) {
        case 'geolocation':
          return 'geolocation' in navigator
        case 'websockets':
          return 'WebSocket' in window
        case 'webworkers':
          return 'Worker' in window
        case 'localstorage':
          return 'localStorage' in window
        case 'sessionstorage':
          return 'sessionStorage' in window
        case 'webgl':
          try {
            const canvas = document.createElement('canvas')
            return !!(
              window.WebGLRenderingContext &&
              (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
            )
          } catch (e) {
            return false
          }
        default:
          return false
      }
    } catch (_error) {
      return false
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
  getUserAgent: BrowserServiceClass.getUserAgent,
  supportsFeature: BrowserServiceClass.supportsFeature,
  isInIframe: BrowserServiceClass.isInIframe
}
