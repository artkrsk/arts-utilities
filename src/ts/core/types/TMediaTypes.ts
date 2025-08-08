/**
 * Represents the type of media file based on its extension or URL.
 * Used for categorizing files as images, videos, audio, streaming platforms, or unknown types.
 *
 * @example
 * ```typescript
 * const imageType: TMediaType = 'image'
 * const videoType: TMediaType = 'video'
 * const audioType: TMediaType = 'audio'
 * const streamType: TMediaType = 'youtube'
 * const unknownType: TMediaType = null
 * ```
 */
export type TMediaType = 'image' | 'video' | 'audio' | 'youtube' | 'vimeo' | null

/**
 * Configuration options for generating video embed URLs.
 * Provides control over embed behavior and features.
 *
 * @example
 * ```typescript
 * const embedOptions: TVideoEmbedOptions = {
 *   autoplay: true,
 *   enablejsapi: true
 * }
 * ```
 */
export interface TVideoEmbedOptions {
  /** Whether to enable autoplay (default: false) */
  autoplay?: boolean
  /** Whether to enable JS API for YouTube (default: true) */
  enablejsapi?: boolean
}
