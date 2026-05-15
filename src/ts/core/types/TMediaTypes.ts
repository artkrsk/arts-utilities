/**
 * Result of media-type detection. `null` means unknown / unsupported.
 */
export type TMediaType =
	| "image"
	| "video"
	| "audio"
	| "youtube"
	| "vimeo"
	| null;

/**
 * Options for `generateEmbedURL`.
 *
 * - `privacy: true` switches YouTube to `youtube-nocookie.com` and adds `dnt=1` to Vimeo URLs.
 */
export interface TVideoEmbedOptions {
	/** @default false */
	autoplay?: boolean;
	/** YouTube only. @default true */
	enablejsapi?: boolean;
	/** @default false */
	privacy?: boolean;
}
