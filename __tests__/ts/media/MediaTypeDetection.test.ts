import { describe, it, expect } from 'vitest'
import { getMediaType, detectMediaFromURL } from '../../../src/ts/core/media/MediaTypeDetection'

describe('MediaTypeDetection', () => {
  describe('getMediaType', () => {
    it('should return video for video files', () => {
      expect(getMediaType('video.mp4')).toBe('video')
      expect(getMediaType('movie.avi')).toBe('video')
      expect(getMediaType('clip.mkv')).toBe('video')
      expect(getMediaType('film.webm')).toBe('video')
      expect(getMediaType('content.mov')).toBe('video')
      expect(getMediaType('sample.wmv')).toBe('video')
      expect(getMediaType('test.flv')).toBe('video')
      expect(getMediaType('media.m4v')).toBe('video')
    })

    it('should return audio for audio files', () => {
      expect(getMediaType('song.mp3')).toBe('audio')
      expect(getMediaType('track.wav')).toBe('audio')
      expect(getMediaType('music.ogg')).toBe('audio')
      expect(getMediaType('audio.m4a')).toBe('audio')
      expect(getMediaType('sound.aac')).toBe('audio')
      expect(getMediaType('voice.wma')).toBe('audio')
      expect(getMediaType('podcast.flac')).toBe('audio')
    })

    it('should return image for image files', () => {
      expect(getMediaType('photo.jpg')).toBe('image')
      expect(getMediaType('picture.jpeg')).toBe('image')
      expect(getMediaType('graphic.png')).toBe('image')
      expect(getMediaType('icon.gif')).toBe('image')
      expect(getMediaType('banner.bmp')).toBe('image')
      expect(getMediaType('logo.svg')).toBe('image')
      expect(getMediaType('image.webp')).toBe('image')
      expect(getMediaType('photo.tiff')).toBe('image')
      expect(getMediaType('art.tif')).toBe('image')
    })

    it('should handle case-insensitive extensions', () => {
      expect(getMediaType('video.MP4')).toBe('video')
      expect(getMediaType('audio.MP3')).toBe('audio')
      expect(getMediaType('image.JPG')).toBe('image')
      expect(getMediaType('mixed.WeBm')).toBe('video')
    })

    it('should handle files with paths', () => {
      expect(getMediaType('/path/to/video.mp4')).toBe('video')
      expect(getMediaType('folder/audio.mp3')).toBe('audio')
      expect(getMediaType('./relative/image.jpg')).toBe('image')
      expect(getMediaType('../parent/media.webm')).toBe('video')
    })

    it('should handle query parameters and fragments', () => {
      expect(getMediaType('video.mp4?v=1.0&quality=hd')).toBe('video')
      expect(getMediaType('audio.mp3#timestamp=30s')).toBe('audio')
      expect(getMediaType('image.jpg?width=800&height=600')).toBe('image')
    })

    it('should handle edge cases in URL parsing', () => {
      // Test the fallback path when URL constructor throws
      expect(getMediaType('?invalid-url-with-only-query')).toBeNull()
      expect(getMediaType('#invalid-url-with-only-fragment')).toBeNull()
      // Test when urlWithoutQuery is undefined (edge case)
      expect(getMediaType('???')).toBeNull()
    })

    it('should return null for unknown or invalid files', () => {
      expect(getMediaType('document.pdf')).toBeNull()
      expect(getMediaType('text.txt')).toBeNull()
      expect(getMediaType('archive.zip')).toBeNull()
      expect(getMediaType('no-extension')).toBeNull()
      expect(getMediaType('')).toBeNull()
      expect(getMediaType('.')).toBeNull()
    })

    it('should handle null and undefined inputs', () => {
      expect(getMediaType(null as any)).toBeNull()
      expect(getMediaType(undefined as any)).toBeNull()
    })

    it('should handle non-string inputs', () => {
      expect(getMediaType(123 as any)).toBeNull()
      expect(getMediaType({} as any)).toBeNull()
      expect(getMediaType([] as any)).toBeNull()
    })
  })

  describe('detectMediaFromURL', () => {
    describe('YouTube detection', () => {
      it('should detect standard YouTube URLs', () => {
        expect(detectMediaFromURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('youtube')
        expect(detectMediaFromURL('https://youtube.com/watch?v=dQw4w9WgXcQ')).toBe('youtube')
        expect(detectMediaFromURL('http://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('youtube')
      })

      it('should detect YouTube short URLs', () => {
        expect(detectMediaFromURL('https://youtu.be/dQw4w9WgXcQ')).toBe('youtube')
        expect(detectMediaFromURL('http://youtu.be/dQw4w9WgXcQ')).toBe('youtube')
      })

      it('should detect YouTube embed URLs', () => {
        expect(detectMediaFromURL('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('youtube')
        expect(detectMediaFromURL('https://youtube.com/embed/dQw4w9WgXcQ')).toBe('youtube')
      })

      it('should detect YouTube mobile URLs', () => {
        expect(detectMediaFromURL('https://m.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('youtube')
        expect(detectMediaFromURL('http://m.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('youtube')
      })

      it('should detect YouTube nocookie URLs', () => {
        expect(detectMediaFromURL('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')).toBe(
          'youtube'
        )
      })
    })

    describe('Vimeo detection', () => {
      it('should detect standard Vimeo URLs', () => {
        expect(detectMediaFromURL('https://vimeo.com/123456789')).toBe('vimeo')
        expect(detectMediaFromURL('http://vimeo.com/123456789')).toBe('vimeo')
        expect(detectMediaFromURL('https://www.vimeo.com/123456789')).toBe('vimeo')
      })

      it('should detect Vimeo player URLs', () => {
        expect(detectMediaFromURL('https://player.vimeo.com/video/123456789')).toBe('vimeo')
        expect(detectMediaFromURL('http://player.vimeo.com/video/123456789')).toBe('vimeo')
      })

      it('should detect Vimeo channel URLs', () => {
        expect(detectMediaFromURL('https://vimeo.com/channels/staffpicks/123456789')).toBe('vimeo')
      })

      it('should detect Vimeo groups URLs', () => {
        expect(detectMediaFromURL('https://vimeo.com/groups/shortfilms/videos/123456789')).toBe(
          'vimeo'
        )
      })
    })

    describe('File extension fallback', () => {
      it('should fall back to getMediaType for non-platform URLs', () => {
        expect(detectMediaFromURL('https://example.com/video.mp4')).toBe('video')
        expect(detectMediaFromURL('https://example.com/audio.mp3')).toBe('audio')
        expect(detectMediaFromURL('https://example.com/image.jpg')).toBe('image')
      })

      it('should return null for unsupported file types', () => {
        expect(detectMediaFromURL('https://example.com/document.pdf')).toBeNull()
        expect(detectMediaFromURL('https://example.com/archive.zip')).toBeNull()
      })
    })

    describe('Edge cases', () => {
      it('should handle null and undefined inputs', () => {
        expect(detectMediaFromURL(null as any)).toBeNull()
        expect(detectMediaFromURL(undefined as any)).toBeNull()
      })

      it('should handle non-string inputs', () => {
        expect(detectMediaFromURL(123 as any)).toBeNull()
        expect(detectMediaFromURL({} as any)).toBeNull()
        expect(detectMediaFromURL([] as any)).toBeNull()
      })

      it('should handle empty strings', () => {
        expect(detectMediaFromURL('')).toBeNull()
        expect(detectMediaFromURL('   ')).toBeNull()
      })

      it('should handle invalid URLs', () => {
        expect(detectMediaFromURL('not-a-url')).toBeNull()
        expect(detectMediaFromURL('just-text')).toBeNull()
      })

      it('should handle malformed platform URLs', () => {
        expect(detectMediaFromURL('https://youtube.com')).toBeNull()
        expect(detectMediaFromURL('https://vimeo.com')).toBeNull()
      })
    })
  })
})
