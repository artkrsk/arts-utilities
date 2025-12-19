import type { IGetMediaType, IDetectMediaFromURL } from '../interfaces'
import type { TMediaType } from '../types'

// Compiled regex patterns for better performance
const IMAGE_PATTERN =
  /\.(jpg|jpeg|jfif|pjpeg|pjp|bmp|gif|png|apng|webp|svg|avif|heic|heif|tiff|tif)$/i
const VIDEO_PATTERN = /\.(mp4|ogv|webm|mov|avi|mkv|m4v|wmv|flv)$/i
const AUDIO_PATTERN = /\.(mp3|wav|ogg|m4a|aac|wma|flac)$/i

// URL-based detection patterns for streaming platforms
const YOUTUBE_PATTERN =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu\.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/i
const VIMEO_PATTERN =
  /^((?:https?:)?\/\/)?(?:(?:www|player)\.)?vimeo\.com\/(?:(?:channels\/[A-z]+\/)|(?:groups\/[A-z]+\/videos\/)|(?:video\/))?(\d+)/i

/**
 * Determines the media type of a file based on its URL extension.
 * Handles URLs with query parameters and fragments by extracting the pathname.
 * Focuses on file-based media detection without streaming platform support.
 *
 * @param url - The file URL to analyze
 * @returns The detected media type or null if unknown/invalid
 *
 * @example
 * ```typescript
 * getMediaType('image.jpg?v=123') // returns 'image'
 * getMediaType('video.mp4#t=10') // returns 'video'
 * getMediaType('file.txt') // returns null
 *
 * // Handles complex URLs
 * getMediaType('https://cdn.example.com/assets/photo.webp?resize=800') // returns 'image'
 * getMediaType('/uploads/video.mov') // returns 'video'
 * ```
 */
export const getMediaType: IGetMediaType = (url: string): TMediaType => {
  if (!url || typeof url !== 'string') {
    return null
  }

  // Extract pathname from URL to handle query params and fragments
  let pathname: string
  try {
    pathname = new URL(url).pathname
  } catch {
    // Fallback for relative URLs or malformed URLs
    const urlWithoutQuery = url.split('?')[0]
    const urlWithoutFragment = urlWithoutQuery?.split('#')[0]
    pathname = urlWithoutFragment || url
  }

  if (IMAGE_PATTERN.test(pathname)) {
    return 'image'
  }

  if (VIDEO_PATTERN.test(pathname)) {
    return 'video'
  }

  if (AUDIO_PATTERN.test(pathname)) {
    return 'audio'
  }

  return null
}

/**
 * Detects media type from URL, including streaming platforms like YouTube and Vimeo.
 * Checks URL patterns for streaming services first, then falls back to file extension detection.
 * Provides comprehensive media type detection for both files and streaming platforms.
 *
 * @param url - The URL to analyze
 * @returns The detected media type or null if unknown/invalid
 *
 * @example
 * ```typescript
 * // Streaming platforms
 * detectMediaFromURL('https://youtube.com/watch?v=abc123') // returns 'youtube'
 * detectMediaFromURL('https://youtu.be/abc123') // returns 'youtube'
 * detectMediaFromURL('https://vimeo.com/123456789') // returns 'vimeo'
 *
 * // File-based media (falls back to getMediaType)
 * detectMediaFromURL('video.mp4') // returns 'video'
 * detectMediaFromURL('image.jpg') // returns 'image'
 *
 * // Unknown/unsupported
 * detectMediaFromURL('https://example.com/page') // returns null
 * detectMediaFromURL('document.pdf') // returns null
 * ```
 */
export const detectMediaFromURL: IDetectMediaFromURL = (url: string): TMediaType => {
  if (!url || typeof url !== 'string') {
    return null
  }

  // Check streaming platforms first (higher priority)
  if (YOUTUBE_PATTERN.test(url)) {
    return 'youtube'
  }

  if (VIMEO_PATTERN.test(url)) {
    return 'vimeo'
  }

  // Fall back to file extension detection
  return getMediaType(url)
}
