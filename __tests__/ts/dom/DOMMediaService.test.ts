import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DOMMediaService } from '../../../src/ts/core/dom/DOMMediaService'

describe('DOMMediaService', () => {
  let videoElement: HTMLVideoElement
  let iframeElement: HTMLIFrameElement

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = ''

    // Create test video element
    videoElement = document.createElement('video')
    videoElement.src = 'test-video.mp4'
    document.body.appendChild(videoElement)

    // Create test iframe element
    iframeElement = document.createElement('iframe')
    iframeElement.src = 'about:blank'
    document.body.appendChild(iframeElement)

    // Clear all mocks
    vi.clearAllMocks()
  })

  describe('playVideo', () => {
    it('should play video element successfully', async () => {
      const mockPlay = vi.fn().mockResolvedValue(undefined)
      videoElement.play = mockPlay

      await DOMMediaService.playVideo(videoElement)

      expect(mockPlay).toHaveBeenCalledOnce()
    })

    it('should handle video play promise rejection gracefully', async () => {
      const mockPlay = vi.fn().mockRejectedValue(new Error('User interaction required'))
      videoElement.play = mockPlay

      // Should not throw
      await expect(DOMMediaService.playVideo(videoElement)).resolves.toBeUndefined()
      expect(mockPlay).toHaveBeenCalledOnce()
    })

    it('should handle null video element gracefully', async () => {
      await expect(DOMMediaService.playVideo(null as any)).resolves.toBeUndefined()
    })

    it('should handle undefined video element gracefully', async () => {
      await expect(DOMMediaService.playVideo(undefined as any)).resolves.toBeUndefined()
    })

    it('should handle video element without play method', async () => {
      const invalidVideo = {} as HTMLVideoElement
      await expect(DOMMediaService.playVideo(invalidVideo)).resolves.toBeUndefined()
    })

    it('should handle video element with non-function play property', async () => {
      const invalidVideo = { play: 'not-a-function' } as any
      await expect(DOMMediaService.playVideo(invalidVideo)).resolves.toBeUndefined()
    })

    it('should handle video play method that returns undefined (legacy browsers)', async () => {
      const mockPlay = vi.fn().mockReturnValue(undefined)
      videoElement.play = mockPlay

      await expect(DOMMediaService.playVideo(videoElement)).resolves.toBeUndefined()
      expect(mockPlay).toHaveBeenCalledOnce()
    })

    it('should handle video play method that returns non-promise', async () => {
      const mockPlay = vi.fn().mockReturnValue('not-a-promise')
      videoElement.play = mockPlay

      await expect(DOMMediaService.playVideo(videoElement)).resolves.toBeUndefined()
      expect(mockPlay).toHaveBeenCalledOnce()
    })

    it('should handle synchronous errors during play', async () => {
      const mockPlay = vi.fn().mockImplementation(() => {
        throw new Error('Synchronous error')
      })
      videoElement.play = mockPlay

      await expect(DOMMediaService.playVideo(videoElement)).resolves.toBeUndefined()
      expect(mockPlay).toHaveBeenCalledOnce()
    })
  })

  describe('pauseVideo', () => {
    it('should pause video element successfully', () => {
      const mockPause = vi.fn()
      videoElement.pause = mockPause

      DOMMediaService.pauseVideo(videoElement)

      expect(mockPause).toHaveBeenCalledOnce()
    })

    it('should handle null video element gracefully', () => {
      expect(() => DOMMediaService.pauseVideo(null as any)).not.toThrow()
    })

    it('should handle undefined video element gracefully', () => {
      expect(() => DOMMediaService.pauseVideo(undefined as any)).not.toThrow()
    })

    it('should handle video element without pause method', () => {
      const invalidVideo = {} as HTMLVideoElement
      expect(() => DOMMediaService.pauseVideo(invalidVideo)).not.toThrow()
    })

    it('should handle video element with non-function pause property', () => {
      const invalidVideo = { pause: 'not-a-function' } as any
      expect(() => DOMMediaService.pauseVideo(invalidVideo)).not.toThrow()
    })

    it('should handle synchronous errors during pause', () => {
      const mockPause = vi.fn().mockImplementation(() => {
        throw new Error('Pause error')
      })
      videoElement.pause = mockPause

      expect(() => DOMMediaService.pauseVideo(videoElement)).not.toThrow()
      expect(mockPause).toHaveBeenCalledOnce()
    })
  })

  describe('postMessageToIframe', () => {
    let mockContentWindow: { postMessage: ReturnType<typeof vi.fn> }

    beforeEach(() => {
      mockContentWindow = {
        postMessage: vi.fn()
      }
      Object.defineProperty(iframeElement, 'contentWindow', {
        value: mockContentWindow,
        writable: true
      })
    })

    it('should send message to iframe successfully', () => {
      const message = JSON.stringify({ action: 'play' })
      const targetOrigin = 'https://example.com'

      DOMMediaService.postMessageToIframe(iframeElement, message, targetOrigin)

      expect(mockContentWindow.postMessage).toHaveBeenCalledWith(message, targetOrigin)
    })

    it('should use default targetOrigin when not provided', () => {
      const message = JSON.stringify({ action: 'pause' })

      DOMMediaService.postMessageToIframe(iframeElement, message)

      expect(mockContentWindow.postMessage).toHaveBeenCalledWith(message, '*')
    })

    it('should handle null iframe element gracefully', () => {
      expect(() => DOMMediaService.postMessageToIframe(null as any, 'message')).not.toThrow()
    })

    it('should handle undefined iframe element gracefully', () => {
      expect(() => DOMMediaService.postMessageToIframe(undefined as any, 'message')).not.toThrow()
    })

    it('should handle iframe without contentWindow gracefully', () => {
      Object.defineProperty(iframeElement, 'contentWindow', {
        value: null,
        writable: true
      })

      expect(() => DOMMediaService.postMessageToIframe(iframeElement, 'message')).not.toThrow()
    })

    it('should handle empty message gracefully', () => {
      expect(() => DOMMediaService.postMessageToIframe(iframeElement, '')).not.toThrow()
      expect(mockContentWindow.postMessage).not.toHaveBeenCalled()
    })

    it('should handle null message gracefully', () => {
      expect(() => DOMMediaService.postMessageToIframe(iframeElement, null as any)).not.toThrow()
      expect(mockContentWindow.postMessage).not.toHaveBeenCalled()
    })

    it('should handle undefined message gracefully', () => {
      expect(() =>
        DOMMediaService.postMessageToIframe(iframeElement, undefined as any)
      ).not.toThrow()
      expect(mockContentWindow.postMessage).not.toHaveBeenCalled()
    })

    it('should handle postMessage errors gracefully', () => {
      mockContentWindow.postMessage.mockImplementation(() => {
        throw new Error('Cross-origin error')
      })

      expect(() => DOMMediaService.postMessageToIframe(iframeElement, 'message')).not.toThrow()
      expect(mockContentWindow.postMessage).toHaveBeenCalledWith('message', '*')
    })

    it('should handle complex JSON messages', () => {
      const complexMessage = JSON.stringify({
        event: 'command',
        func: 'playVideo',
        args: [{ startTime: 30 }],
        metadata: { source: 'widget', version: '1.0' }
      })

      DOMMediaService.postMessageToIframe(iframeElement, complexMessage, 'https://www.youtube.com')

      expect(mockContentWindow.postMessage).toHaveBeenCalledWith(
        complexMessage,
        'https://www.youtube.com'
      )
    })

    it('should work with different iframe types', () => {
      // Create YouTube-like iframe
      const youtubeIframe = document.createElement('iframe')
      youtubeIframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ'

      const youtubeContentWindow = { postMessage: vi.fn() }
      Object.defineProperty(youtubeIframe, 'contentWindow', {
        value: youtubeContentWindow,
        writable: true
      })

      const youtubeMessage = JSON.stringify({ event: 'command', func: 'playVideo' })
      DOMMediaService.postMessageToIframe(youtubeIframe, youtubeMessage, 'https://www.youtube.com')

      expect(youtubeContentWindow.postMessage).toHaveBeenCalledWith(
        youtubeMessage,
        'https://www.youtube.com'
      )
    })
  })

  describe('interface compliance', () => {
    it('should implement all required interface methods', () => {
      expect(typeof DOMMediaService.playVideo).toBe('function')
      expect(typeof DOMMediaService.pauseVideo).toBe('function')
      expect(typeof DOMMediaService.postMessageToIframe).toBe('function')
    })

    it('should have correct method signatures', () => {
      expect(DOMMediaService.playVideo.length).toBe(1) // video parameter
      expect(DOMMediaService.pauseVideo.length).toBe(1) // video parameter
      expect(DOMMediaService.postMessageToIframe.length).toBe(2) // iframe, message parameters (targetOrigin has default)
    })
  })
})
