import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { loadMedia } from '../../../src/ts/core/dom/MediaUtils'

// Mock HTMLImageElement
class MockHTMLImageElement {
  src = ''
  complete = false
  naturalWidth = 0
  tagName = 'IMG'
  loading?: string
  decoding?: string
  fetchpriority?: string

  private eventListeners = new Map<string, Function[]>()

  addEventListener(event: string, handler: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)!.push(handler)
  }

  removeEventListener(event: string, handler: Function) {
    const handlers = this.eventListeners.get(event)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  setAttribute(name: string, value: string) {
    ;(this as any)[name] = value
  }

  simulateLoad() {
    this.complete = true
    this.naturalWidth = 100
    const handlers = this.eventListeners.get('load') || []
    handlers.forEach((handler) => handler())
  }

  simulateError() {
    const handlers = this.eventListeners.get('error') || []
    handlers.forEach((handler) => handler())
  }
}

// Mock HTMLVideoElement
class MockHTMLVideoElement {
  src = ''
  readyState = 0
  networkState = 0
  tagName = 'VIDEO'
  preload?: string

  private eventListeners = new Map<string, Function[]>()

  addEventListener(event: string, handler: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)!.push(handler)
  }

  removeEventListener(event: string, handler: Function) {
    const handlers = this.eventListeners.get(event)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  setAttribute(name: string, value: string) {
    ;(this as any)[name] = value
  }

  load() {
    // Simulate loading
  }

  simulateCanPlayThrough() {
    this.readyState = 4 // HAVE_ENOUGH_DATA
    const handlers = this.eventListeners.get('canplaythrough') || []
    handlers.forEach((handler) => handler())
  }

  simulateError() {
    const handlers = this.eventListeners.get('error') || []
    handlers.forEach((handler) => handler())
  }
}

// Mock HTMLElement for other elements
class MockHTMLElement {
  tagName = 'DIV'
}

describe('MediaUtils', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Define HTML media element constants
    global.HTMLMediaElement = {
      HAVE_CURRENT_DATA: 2,
      HAVE_ENOUGH_DATA: 4,
      NETWORK_IDLE: 0
    } as any
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('loadMedia', () => {
    it('should reject when element is null', async () => {
      await expect(loadMedia(null)).rejects.toThrow('Element is required for media loading')
    })

    it('should resolve immediately for already loaded image', async () => {
      const mockImg = new MockHTMLImageElement()
      mockImg.complete = true
      mockImg.naturalWidth = 100
      mockImg.src = 'test.jpg'

      const result = await loadMedia(mockImg as any)
      expect(result).toBe(mockImg)
    })

    it('should wait for image to load', async () => {
      const mockImg = new MockHTMLImageElement()
      mockImg.src = 'test.jpg'

      const promise = loadMedia(mockImg as any)

      // Simulate image loading after some time
      setTimeout(() => {
        mockImg.simulateLoad()
      }, 100)

      vi.advanceTimersByTime(100)
      const result = await promise

      expect(result).toBe(mockImg)
    })

    it('should set priority attributes for images by default', async () => {
      const mockImg = new MockHTMLImageElement()
      mockImg.src = 'test.jpg'

      const promise = loadMedia(mockImg as any)

      expect(mockImg.loading).toBe('eager')
      expect(mockImg.decoding).toBe('sync')
      expect(mockImg.fetchpriority).toBe('high')

      setTimeout(() => mockImg.simulateLoad(), 50)
      vi.advanceTimersByTime(50)
      await promise
    })

    it('should not set priority attributes when setPriority is false', async () => {
      const mockImg = new MockHTMLImageElement()
      mockImg.src = 'test.jpg'

      const promise = loadMedia(mockImg as any, { setPriority: false })

      expect(mockImg.loading).toBeUndefined()
      expect(mockImg.decoding).toBeUndefined()
      expect(mockImg.fetchpriority).toBeUndefined()

      setTimeout(() => mockImg.simulateLoad(), 50)
      vi.advanceTimersByTime(50)
      await promise
    })

    it('should reject when image fails to load', async () => {
      const mockImg = new MockHTMLImageElement()
      mockImg.src = 'invalid.jpg'

      const promise = loadMedia(mockImg as any)

      setTimeout(() => {
        mockImg.simulateError()
      }, 100)

      vi.advanceTimersByTime(100)

      await expect(promise).rejects.toThrow('Image failed to load: invalid.jpg')
    })

    it('should resolve immediately for ready video', async () => {
      const mockVideo = new MockHTMLVideoElement()
      mockVideo.readyState = 3 // HAVE_CURRENT_DATA or higher
      mockVideo.src = 'test.mp4'

      const result = await loadMedia(mockVideo as any)
      expect(result).toBe(mockVideo)
    })

    it('should wait for video to be ready', async () => {
      const mockVideo = new MockHTMLVideoElement()
      mockVideo.src = 'test.mp4'
      mockVideo.readyState = 1 // HAVE_METADATA

      const promise = loadMedia(mockVideo as any)

      setTimeout(() => {
        mockVideo.simulateCanPlayThrough()
      }, 100)

      vi.advanceTimersByTime(100)
      const result = await promise

      expect(result).toBe(mockVideo)
    })

    it('should set preload attribute for videos by default', async () => {
      const mockVideo = new MockHTMLVideoElement()
      mockVideo.src = 'test.mp4'

      const promise = loadMedia(mockVideo as any)

      expect(mockVideo.preload).toBe('auto')

      setTimeout(() => mockVideo.simulateCanPlayThrough(), 50)
      vi.advanceTimersByTime(50)
      await promise
    })

    it('should reject when video fails to load', async () => {
      const mockVideo = new MockHTMLVideoElement()
      mockVideo.src = 'invalid.mp4'

      const promise = loadMedia(mockVideo as any)

      setTimeout(() => {
        mockVideo.simulateError()
      }, 100)

      vi.advanceTimersByTime(100)

      await expect(promise).rejects.toThrow('Video failed to load: invalid.mp4')
    })

    it('should resolve immediately for non-media elements', async () => {
      const mockDiv = new MockHTMLElement()
      mockDiv.tagName = 'DIV'

      const result = await loadMedia(mockDiv as any)
      expect(result).toBe(mockDiv)
    })

    it('should respect custom timeout', async () => {
      const mockImg = new MockHTMLImageElement()
      mockImg.src = 'slow-loading.jpg'

      const promise = loadMedia(mockImg as any, { timeout: 1000 })

      // Don't simulate load, let it timeout
      vi.advanceTimersByTime(1000)

      await expect(promise).rejects.toThrow('Media loading timed out after 1000ms')
    })

    it('should not timeout when timeout is 0', async () => {
      const mockImg = new MockHTMLImageElement()
      mockImg.src = 'test.jpg'

      const promise = loadMedia(mockImg as any, { timeout: 0 })

      // Advance time significantly
      vi.advanceTimersByTime(20000)

      // Simulate load after long delay
      setTimeout(() => mockImg.simulateLoad(), 0)
      vi.advanceTimersByTime(1)

      const result = await promise
      expect(result).toBe(mockImg)
    })

    it('should clean up event listeners on success', async () => {
      const mockImg = new MockHTMLImageElement()
      mockImg.src = 'test.jpg'

      const removeEventListenerSpy = vi.spyOn(mockImg, 'removeEventListener')

      const promise = loadMedia(mockImg as any)

      setTimeout(() => mockImg.simulateLoad(), 50)
      vi.advanceTimersByTime(50)
      await promise

      expect(removeEventListenerSpy).toHaveBeenCalledWith('load', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function))
    })

    it('should clean up event listeners on error', async () => {
      const mockImg = new MockHTMLImageElement()
      mockImg.src = 'invalid.jpg'

      const removeEventListenerSpy = vi.spyOn(mockImg, 'removeEventListener')

      const promise = loadMedia(mockImg as any)

      setTimeout(() => mockImg.simulateError(), 50)
      vi.advanceTimersByTime(50)

      try {
        await promise
      } catch (error) {
        // Expected to throw
      }

      expect(removeEventListenerSpy).toHaveBeenCalledWith('load', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function))
    })

    it('should handle combined options correctly', async () => {
      const mockImg = new MockHTMLImageElement()
      mockImg.src = 'test.jpg'

      const promise = loadMedia(mockImg as any, {
        timeout: 5000,
        setPriority: false
      })

      // Verify priority attributes are not set
      expect(mockImg.loading).toBeUndefined()

      setTimeout(() => mockImg.simulateLoad(), 100)
      vi.advanceTimersByTime(100)

      const result = await promise
      expect(result).toBe(mockImg)
    })

    it('should handle images with empty src', async () => {
      const mockImg = new MockHTMLImageElement()
      // No src set

      const promise = loadMedia(mockImg as any)

      setTimeout(() => mockImg.simulateError(), 50)
      vi.advanceTimersByTime(50)

      await expect(promise).rejects.toThrow('Image failed to load: unknown source')
    })

    it('should handle videos with empty src', async () => {
      const mockVideo = new MockHTMLVideoElement()
      // No src set

      const promise = loadMedia(mockVideo as any)

      setTimeout(() => mockVideo.simulateError(), 50)
      vi.advanceTimersByTime(50)

      await expect(promise).rejects.toThrow('Video failed to load: unknown source')
    })

    it('should work with different element types', async () => {
      const elements = [
        { element: new MockHTMLElement(), tagName: 'SPAN' },
        { element: new MockHTMLElement(), tagName: 'P' },
        { element: new MockHTMLElement(), tagName: 'CANVAS' }
      ]

      for (const { element, tagName } of elements) {
        element.tagName = tagName
        const result = await loadMedia(element as any)
        expect(result).toBe(element)
      }
    })
  })
})
