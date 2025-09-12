/**
 * Interface for DOM media operations service providing type-safe media element manipulation.
 * Handles video/audio playback controls and iframe communication with consistent error handling.
 * Serves as a foundation for media-rich applications requiring reliable media element interaction.
 *
 * @example
 * ```typescript
 * // Service initialization and basic usage
 * const mediaService: IDOMMediaService = DOMMediaService;
 *
 * // Video operations
 * const video = document.querySelector('video') as HTMLVideoElement;
 * await mediaService.playVideo(video);
 * mediaService.pauseVideo(video);
 *
 * // Iframe communication
 * const iframe = document.querySelector('iframe') as HTMLIFrameElement;
 * mediaService.postMessageToIframe(iframe, JSON.stringify({ action: 'play' }));
 * ```
 */
export interface IDOMMediaService {
  /**
   * Plays a video element with proper error handling and promise support.
   * Handles the asynchronous nature of video.play() and provides fallback for unsupported elements.
   *
   * @param video - HTMLVideoElement to play
   * @returns Promise that resolves when video starts playing or immediately if element is invalid
   *
   * @example
   * ```typescript
   * const video = document.querySelector('#main-video') as HTMLVideoElement;
   *
   * try {
   *   await mediaService.playVideo(video);
   *   console.log('Video started playing');
   * } catch (error) {
   *   console.error('Failed to play video:', error);
   * }
   *
   * // With error handling for user interaction requirements
   * const playButton = document.querySelector('#play-btn');
   * playButton?.addEventListener('click', async () => {
   *   await mediaService.playVideo(video);
   * });
   * ```
   */
  playVideo: (video: HTMLVideoElement) => Promise<void>

  /**
   * Pauses a video element with null safety and error handling.
   * Provides consistent behavior across different video states and element types.
   *
   * @param video - HTMLVideoElement to pause
   *
   * @example
   * ```typescript
   * const video = document.querySelector('#main-video') as HTMLVideoElement;
   * const pauseButton = document.querySelector('#pause-btn');
   *
   * pauseButton?.addEventListener('click', () => {
   *   mediaService.pauseVideo(video);
   *   console.log('Video paused');
   * });
   *
   * // Safe to call on null/undefined elements
   * const maybeVideo = document.querySelector('.nonexistent') as HTMLVideoElement;
   * mediaService.pauseVideo(maybeVideo); // Won't throw error
   * ```
   */
  pauseVideo: (video: HTMLVideoElement) => void

  /**
   * Sends a message to an iframe's content window with origin validation support.
   * Enables secure communication with embedded content like YouTube players or custom widgets.
   *
   * @param iframe - HTMLIFrameElement to send message to
   * @param message - Message string to send (typically JSON.stringify'd object)
   * @param targetOrigin - Target origin for security (defaults to '*' for any origin)
   *
   * @example
   * ```typescript
   * const youtubeIframe = document.querySelector('#youtube-player') as HTMLIFrameElement;
   *
   * // Send play command to YouTube player
   * const playCommand = JSON.stringify({
   *   event: 'command',
   *   func: 'playVideo'
   * });
   * mediaService.postMessageToIframe(youtubeIframe, playCommand, 'https://www.youtube.com');
   *
   * // Send pause command
   * const pauseCommand = JSON.stringify({
   *   event: 'command',
   *   func: 'pauseVideo'
   * });
   * mediaService.postMessageToIframe(youtubeIframe, pauseCommand, 'https://www.youtube.com');
   *
   * // Generic iframe communication
   * const customIframe = document.querySelector('#custom-widget') as HTMLIFrameElement;
   * const customMessage = JSON.stringify({ action: 'updateData', data: { count: 42 } });
   * mediaService.postMessageToIframe(customIframe, customMessage);
   * ```
   */
  postMessageToIframe: (iframe: HTMLIFrameElement, message: string, targetOrigin?: string) => void
}
