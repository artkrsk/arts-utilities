import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { extractVideoID, generateEmbedURL } from '../../../src/ts/core/media/VideoURLUtils'

describe('VideoURLUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  describe('extractVideoID', () => {
    describe('YouTube ID extraction', () => {
      it('should extract ID from standard YouTube URLs', () => {
        expect(extractVideoID('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
        expect(extractVideoID('https://youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
        expect(extractVideoID('http://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
      })

      it('should extract ID from YouTube short URLs', () => {
        expect(extractVideoID('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
        expect(extractVideoID('http://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
        expect(extractVideoID('youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
      })

      it('should extract ID from YouTube embed URLs', () => {
        expect(extractVideoID('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
        expect(extractVideoID('https://youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
      })

      it('should extract ID from YouTube mobile URLs', () => {
        expect(extractVideoID('https://m.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
        expect(extractVideoID('http://m.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
      })

      it('should extract ID from YouTube URLs with additional parameters', () => {
        expect(extractVideoID('https://youtube.com/watch?v=dQw4w9WgXcQ&t=10s')).toBe('dQw4w9WgXcQ')
        expect(extractVideoID('https://youtu.be/dQw4w9WgXcQ?t=10s')).toBe('dQw4w9WgXcQ')
      })

      it('should extract ID from YouTube nocookie URLs', () => {
        expect(extractVideoID('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')).toBe(
          'dQw4w9WgXcQ'
        )
      })
    })

    describe('Vimeo ID extraction', () => {
      it('should extract ID from standard Vimeo URLs', () => {
        expect(extractVideoID('https://vimeo.com/123456789')).toBe('123456789')
        expect(extractVideoID('http://vimeo.com/123456789')).toBe('123456789')
        expect(extractVideoID('https://www.vimeo.com/123456789')).toBe('123456789')
      })

      it('should extract ID from Vimeo player URLs', () => {
        expect(extractVideoID('https://player.vimeo.com/video/123456789')).toBe('123456789')
        expect(extractVideoID('http://player.vimeo.com/video/123456789')).toBe('123456789')
      })

      it('should extract ID from Vimeo channel URLs', () => {
        expect(extractVideoID('https://vimeo.com/channels/staffpicks/123456789')).toBe('123456789')
      })

      it('should extract ID from Vimeo groups URLs', () => {
        expect(extractVideoID('https://vimeo.com/groups/shortfilms/videos/123456789')).toBe(
          '123456789'
        )
      })
    })

    describe('Edge cases', () => {
      it('should return null for unsupported platforms', () => {
        expect(extractVideoID('https://example.com/video.mp4')).toBeNull()
        expect(extractVideoID('https://dailymotion.com/video/abc123')).toBeNull()
      })

      it('should return null for malformed URLs', () => {
        expect(extractVideoID('https://youtube.com')).toBeNull()
        expect(extractVideoID('https://vimeo.com')).toBeNull()
        expect(extractVideoID('not-a-url')).toBeNull()
      })

      it('should handle null and undefined inputs', () => {
        expect(extractVideoID(null as any)).toBeNull()
        expect(extractVideoID(undefined as any)).toBeNull()
      })

      it('should handle non-string inputs', () => {
        expect(extractVideoID(123 as any)).toBeNull()
        expect(extractVideoID({} as any)).toBeNull()
        expect(extractVideoID([] as any)).toBeNull()
      })

      it('should handle empty strings', () => {
        expect(extractVideoID('')).toBeNull()
        expect(extractVideoID('   ')).toBeNull()
      })
    })
  })

  describe('generateEmbedURL', () => {
    describe('YouTube embed generation', () => {
      it('should generate basic YouTube embed URLs', () => {
        const result = generateEmbedURL('https://youtube.com/watch?v=dQw4w9WgXcQ')
        expect(result).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1')
      })

      it('should generate YouTube embed URLs with autoplay', () => {
        const result = generateEmbedURL('https://youtube.com/watch?v=dQw4w9WgXcQ', {
          autoplay: true
        })
        expect(result).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&enablejsapi=1')
      })

      it('should generate YouTube embed URLs without JS API', () => {
        const result = generateEmbedURL('https://youtube.com/watch?v=dQw4w9WgXcQ', {
          enablejsapi: false
        })
        expect(result).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ')
      })

      it('should generate YouTube embed URLs with both options', () => {
        const result = generateEmbedURL('https://youtube.com/watch?v=dQw4w9WgXcQ', {
          autoplay: true,
          enablejsapi: false
        })
        expect(result).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1')
      })

      it('should generate privacy-enhanced YouTube embed URLs', () => {
        const result = generateEmbedURL('https://youtube.com/watch?v=dQw4w9WgXcQ', {
          privacy: true
        })
        expect(result).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?enablejsapi=1')
      })

      it('should generate privacy-enhanced YouTube embed URLs with autoplay', () => {
        const result = generateEmbedURL('https://youtube.com/watch?v=dQw4w9WgXcQ', {
          privacy: true,
          autoplay: true
        })
        expect(result).toBe(
          'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&enablejsapi=1'
        )
      })

      it('should generate privacy-enhanced YouTube embed URLs without JS API', () => {
        const result = generateEmbedURL('https://youtube.com/watch?v=dQw4w9WgXcQ', {
          privacy: true,
          enablejsapi: false
        })
        expect(result).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')
      })

      it('should work with YouTube short URLs', () => {
        const result = generateEmbedURL('https://youtu.be/dQw4w9WgXcQ')
        expect(result).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1')
      })
    })

    describe('Vimeo embed generation', () => {
      it('should generate basic Vimeo embed URLs', () => {
        const result = generateEmbedURL('https://vimeo.com/123456789')
        expect(result).toBe('https://player.vimeo.com/video/123456789')
      })

      it('should generate Vimeo embed URLs with autoplay', () => {
        const result = generateEmbedURL('https://vimeo.com/123456789', { autoplay: true })
        expect(result).toBe('https://player.vimeo.com/video/123456789?autoplay=1')
      })

      it('should generate privacy-enhanced Vimeo embed URLs', () => {
        const result = generateEmbedURL('https://vimeo.com/123456789', { privacy: true })
        expect(result).toBe('https://player.vimeo.com/video/123456789?dnt=1')
      })

      it('should generate privacy-enhanced Vimeo embed URLs with autoplay', () => {
        const result = generateEmbedURL('https://vimeo.com/123456789', {
          privacy: true,
          autoplay: true
        })
        expect(result).toBe('https://player.vimeo.com/video/123456789?autoplay=1&dnt=1')
      })

      it('should ignore enablejsapi for Vimeo', () => {
        const result = generateEmbedURL('https://vimeo.com/123456789', { enablejsapi: false })
        expect(result).toBe('https://player.vimeo.com/video/123456789')
      })

      it('should work with Vimeo player URLs', () => {
        const result = generateEmbedURL('https://player.vimeo.com/video/123456789')
        expect(result).toBe('https://player.vimeo.com/video/123456789')
      })
    })

    describe('Fallback behavior', () => {
      it('should return original URL for unsupported platforms', () => {
        const url = 'https://example.com/video.mp4'
        expect(generateEmbedURL(url)).toBe(url)
      })

      it('should return original URL for malformed URLs', () => {
        const url = 'https://youtube.com'
        expect(generateEmbedURL(url)).toBe(url)
      })

      it('should handle null and undefined inputs', () => {
        expect(generateEmbedURL(null as any)).toBe(null)
        expect(generateEmbedURL(undefined as any)).toBe(undefined)
      })

      it('should handle non-string inputs', () => {
        expect(generateEmbedURL(123 as any)).toBe(123)
        expect(generateEmbedURL({} as any)).toStrictEqual({})
        expect(generateEmbedURL([] as any)).toStrictEqual([])
      })

      it('should handle empty strings', () => {
        expect(generateEmbedURL('')).toBe('')
      })
    })

    describe('Options handling', () => {
      it('should handle default options', () => {
        const result = generateEmbedURL('https://youtube.com/watch?v=dQw4w9WgXcQ', {})
        expect(result).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1')
      })

      it('should handle undefined options', () => {
        const result = generateEmbedURL('https://youtube.com/watch?v=dQw4w9WgXcQ', undefined)
        expect(result).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1')
      })

      it('should handle partial options', () => {
        const result = generateEmbedURL('https://youtube.com/watch?v=dQw4w9WgXcQ', {
          autoplay: true
        })
        expect(result).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&enablejsapi=1')
      })

      it('should handle privacy option only', () => {
        const youtubeResult = generateEmbedURL('https://youtube.com/watch?v=dQw4w9WgXcQ', {
          privacy: true
        })
        expect(youtubeResult).toBe(
          'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?enablejsapi=1'
        )

        const vimeoResult = generateEmbedURL('https://vimeo.com/123456789', { privacy: true })
        expect(vimeoResult).toBe('https://player.vimeo.com/video/123456789?dnt=1')
      })
    })
  })
})
