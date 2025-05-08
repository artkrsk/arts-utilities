/**
 * Interface for browser operations service
 */
export interface IBrowserService {
  /**
   * Check if a media query matches
   */
  matchMedia: (query: string) => boolean

  /**
   * Get current viewport width
   */
  getViewportWidth: () => number

  /**
   * Get current viewport height
   */
  getViewportHeight: () => number

  /**
   * Get the current user agent
   */
  getUserAgent: () => string

  /**
   * Check if the browser supports a specific feature
   */
  supportsFeature: (featureName: string) => boolean

  /**
   * Check if the page is loaded in an iframe
   */
  isInIframe: () => boolean
}
