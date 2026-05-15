/**
 * Null-safe media element helpers. Every method silently no-ops (or resolves) on null/invalid input
 * instead of throwing, so they are safe to call against optional query results.
 */
export interface IDOMMediaService {
	/**
	 * Calls `video.play()` and swallows the returned promise's rejection (e.g. autoplay-policy errors).
	 * Resolves immediately when `video` is null or `play` isn't callable.
	 */
	playVideo: (video: HTMLVideoElement) => Promise<void>;

	/** Calls `video.pause()`. No-op when `video` is null or `pause` isn't callable. */
	pauseVideo: (video: HTMLVideoElement) => void;

	/**
	 * Calls `iframe.contentWindow.postMessage(message, targetOrigin)`.
	 * No-op when the iframe, its `contentWindow`, or the message is missing.
	 *
	 * @param targetOrigin - Defaults to `'*'`.
	 */
	postMessageToIframe: (
		iframe: HTMLIFrameElement,
		message: string,
		targetOrigin?: string,
	) => void;
}
