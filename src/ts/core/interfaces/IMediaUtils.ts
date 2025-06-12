/**
 * Options for configuring media loading behavior
 */
export interface ILoadMediaOptions {
  /**
   * Timeout in milliseconds for media loading
   * @default 10000
   */
  timeout?: number

  /**
   * Whether to set priority attributes for faster loading
   * @default true
   */
  setPriority?: boolean
}

/**
 * Interface for media utility functions
 */
export interface IMediaUtils {
  /**
   * Loads a media element (image or video) and resolves when ready
   *
   * @param element - The media element to load (img, video, or other)
   * @param options - Configuration options for loading behavior
   * @returns Promise that resolves with the element when loaded, or rejects on timeout
   */
  loadMedia: (
    element: HTMLElement | null,
    options?: ILoadMediaOptions
  ) => Promise<HTMLElement>
}
