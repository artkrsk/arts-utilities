import type { IExtractVideoID, IGenerateEmbedURL } from '../interfaces'
import type { TVideoEmbedOptions } from '../types'
import { detectMediaFromURL } from './MediaTypeDetection'

// URL-based detection patterns for streaming platforms
const YOUTUBE_PATTERN =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu\.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/i
const VIMEO_PATTERN =
  /^((?:https?:)?\/\/)?(?:(?:www|player)\.)?vimeo\.com\/(?:(?:channels\/[A-z]+\/)|(?:groups\/[A-z]+\/videos\/)|(?:video\/))?(\d+)/i

/**
 * Extracts video ID from YouTube or Vimeo URLs.
 * Returns the video ID that can be used for embedding or API calls.
 * Supports various URL formats for each platform.
 *
 * @param url - The video URL to extract ID from
 * @returns The extracted video ID or null if not found/unsupported
 *
 * @example
 * ```typescript
 * // YouTube formats
 * extractVideoID('https://youtube.com/watch?v=abc123xyz') // returns 'abc123xyz'
 * extractVideoID('https://youtu.be/abc123xyz') // returns 'abc123xyz'
 * extractVideoID('https://youtube.com/embed/abc123xyz') // returns 'abc123xyz'
 * extractVideoID('https://m.youtube.com/watch?v=abc123xyz') // returns 'abc123xyz'
 *
 * // Vimeo formats
 * extractVideoID('https://vimeo.com/123456789') // returns '123456789'
 * extractVideoID('https://player.vimeo.com/video/123456789') // returns '123456789'
 *
 * // Unsupported URLs
 * extractVideoID('https://example.com/video.mp4') // returns null
 * extractVideoID('invalid-url') // returns null
 * ```
 */
export const extractVideoID: IExtractVideoID = (url: string): string | null => {
  if (!url || typeof url !== 'string') {
    return null
  }

  const mediaType = detectMediaFromURL(url)

  switch (mediaType) {
    case 'youtube': {
      const match = url.match(YOUTUBE_PATTERN)
      // YouTube ID is in capture group 5 (index 5)
      /* c8 ignore next */
      return match?.[5] || null
    }

    case 'vimeo': {
      const match = url.match(VIMEO_PATTERN)
      // Vimeo ID is in capture group 2 (index 2)
      /* c8 ignore next */
      return match?.[2] || null
    }

    default:
      return null
  }
}

/**
 * Generates an embed URL for YouTube or Vimeo videos.
 * Converts various video URL formats to their embeddable equivalents.
 * Provides configuration options for autoplay, JavaScript API access, and privacy-enhanced embedding.
 *
 * @param url - The original video URL
 * @param options - Embed configuration options
 * @param options.autoplay - Whether to enable autoplay (default: false)
 * @param options.enablejsapi - Whether to enable JS API for YouTube (default: true)
 * @param options.privacy - Whether to use privacy-enhanced embedding (default: false)
 * @returns The embed URL or original URL if not a supported video platform
 *
 * @example
 * ```typescript
 * // Basic YouTube embed
 * generateEmbedURL('https://youtube.com/watch?v=abc123')
 * // returns 'https://www.youtube.com/embed/abc123?enablejsapi=1'
 *
 * // YouTube with autoplay
 * generateEmbedURL('https://youtu.be/abc123', { autoplay: true })
 * // returns 'https://www.youtube.com/embed/abc123?autoplay=1&enablejsapi=1'
 *
 * // YouTube with privacy-enhanced embedding
 * generateEmbedURL('https://youtube.com/watch?v=abc123', { privacy: true })
 * // returns 'https://www.youtube-nocookie.com/embed/abc123?enablejsapi=1'
 *
 * // Vimeo with autoplay
 * generateEmbedURL('https://vimeo.com/123456789', { autoplay: true })
 * // returns 'https://player.vimeo.com/video/123456789?autoplay=1'
 *
 * // Vimeo with privacy-enhanced embedding
 * generateEmbedURL('https://vimeo.com/123456789', { privacy: true })
 * // returns 'https://player.vimeo.com/video/123456789?dnt=1'
 *
 * // Disable YouTube JS API
 * generateEmbedURL('https://youtube.com/watch?v=abc123', { enablejsapi: false })
 * // returns 'https://www.youtube.com/embed/abc123'
 *
 * // Non-video URLs return unchanged
 * generateEmbedURL('https://example.com/video.mp4')
 * // returns 'https://example.com/video.mp4'
 * ```
 */
export const generateEmbedURL: IGenerateEmbedURL = (
  url: string,
  options: TVideoEmbedOptions = {}
): string => {
  if (!url || typeof url !== 'string') {
    return url
  }

  const { autoplay = false, enablejsapi = true, privacy = false } = options
  const videoId = extractVideoID(url)
  const mediaType = detectMediaFromURL(url)

  if (!videoId) {
    return url
  }

  switch (mediaType) {
    case 'youtube': {
      const params = new URLSearchParams()
      if (autoplay) params.set('autoplay', '1')
      if (enablejsapi) params.set('enablejsapi', '1')

      const queryString = params.toString()
      const domain = privacy ? 'www.youtube-nocookie.com' : 'www.youtube.com'
      return `https://${domain}/embed/${videoId}${queryString ? `?${queryString}` : ''}`
    }

    case 'vimeo': {
      const params = new URLSearchParams()
      if (autoplay) params.set('autoplay', '1')
      if (privacy) params.set('dnt', '1')

      const queryString = params.toString()
      return `https://player.vimeo.com/video/${videoId}${queryString ? `?${queryString}` : ''}`
    }
    /* c8 ignore next */
    default:
      // This case is currently unreachable due to the logic in extractVideoID
      // which only returns IDs for known platforms. Kept for defensive programming.
      /* c8 ignore next */
      return url
  }
}
