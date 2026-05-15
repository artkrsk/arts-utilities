import type { TMediaType, TVideoEmbedOptions } from "../types";

/**
 * Options for {@link IMediaUtils.loadMedia}.
 */
export interface ILoadMediaOptions {
	/**
	 * Milliseconds before the promise rejects. `0` disables the timeout.
	 *
	 * @default 10000
	 */
	timeout?: number;

	/**
	 * When `true`, sets `loading="eager"`, `decoding="sync"`, `fetchpriority="high"` on images
	 * and `preload="auto"` on videos before waiting for the load event.
	 *
	 * @default true
	 */
	setPriority?: boolean;
}

/**
 * Loaders for media elements that branch on tag name.
 */
export interface IMediaUtils {
	/**
	 * Resolves once the element is ready to display:
	 * - `IMG` — resolves immediately when `complete && naturalWidth > 0`, otherwise on the `load` event. Rejects on `error`.
	 *   When the image already has a `src` but hasn't completed, the loader forces a reload by clearing and restoring `src`.
	 * - `VIDEO` — resolves immediately when `readyState >= HAVE_CURRENT_DATA`, otherwise on `loadeddata`. Rejects on `error`.
	 *   Calls `.load()` when `networkState === NETWORK_IDLE`.
	 * - Any other tag — resolves immediately with the element.
	 *
	 * Rejects synchronously with `"Element is required for media loading"` when `element` is null.
	 */
	loadMedia: (
		element: HTMLElement | null,
		options?: ILoadMediaOptions,
	) => Promise<HTMLElement>;
}

/**
 * Detects media type from a URL's file extension. Returns `null` for unknown extensions.
 */
export type IGetMediaType = (url: string) => TMediaType;

/**
 * Detects media type from a URL: streaming-platform patterns are matched first, then falls back to file-extension detection.
 */
export type IDetectMediaFromURL = (url: string) => TMediaType;

/**
 * Extracts the platform-specific ID from a YouTube or Vimeo URL. Returns `null` when the URL is from an unsupported platform.
 */
export type IExtractVideoID = (url: string) => string | null;

/**
 * Converts a YouTube or Vimeo URL to its embed form, honoring privacy-mode flags
 * (`youtube-nocookie.com` for YouTube, the `dnt` query parameter for Vimeo).
 * Returns the original URL unchanged when the platform is not recognized.
 */
export type IGenerateEmbedURL = (
	url: string,
	options?: TVideoEmbedOptions,
) => string;
