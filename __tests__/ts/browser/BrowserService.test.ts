import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { BrowserService } from '../../../src/ts/core/browser/BrowserService'

// Mock objects for testing
const createMockWindow = () => ({
  matchMedia: vi.fn(),
  innerWidth: 1024,
  innerHeight: 768,
  self: null as any,
  top: null as any
})

const mockDocument = {
  documentElement: {
    clientWidth: 1200,
    clientHeight: 800
  }
}

describe('BrowserService', () => {
  let mockWindow: ReturnType<typeof createMockWindow>

  beforeEach(() => {
    // Create fresh mock for each test
    mockWindow = createMockWindow()
    mockWindow.self = mockWindow
    mockWindow.top = mockWindow

    // Mock global window and document
    global.window = mockWindow as any
    global.document = mockDocument as any

    // Reset all mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('matchMedia', () => {
    it('should return true when media query matches', () => {
      const mockMediaQueryList = { matches: true }
      mockWindow.matchMedia.mockReturnValue(mockMediaQueryList)

      const result = BrowserService.matchMedia('(max-width: 768px)')

      expect(mockWindow.matchMedia).toHaveBeenCalledWith('(max-width: 768px)')
      expect(result).toBe(true)
    })

    it('should return false when media query does not match', () => {
      const mockMediaQueryList = { matches: false }
      mockWindow.matchMedia.mockReturnValue(mockMediaQueryList)

      const result = BrowserService.matchMedia('(max-width: 768px)')

      expect(result).toBe(false)
    })

    it('should return false when matchMedia throws an error', () => {
      mockWindow.matchMedia.mockImplementation(() => {
        throw new Error('matchMedia not supported')
      })

      const result = BrowserService.matchMedia('(max-width: 768px)')

      expect(result).toBe(false)
    })

    it('should handle different media query formats', () => {
      const testQueries = [
        '(min-width: 1200px)',
        '(orientation: landscape)',
        '(hover: hover)',
        'print',
        'screen and (max-width: 600px)'
      ]

      testQueries.forEach((query) => {
        mockWindow.matchMedia.mockReturnValue({ matches: true })
        const result = BrowserService.matchMedia(query)
        expect(mockWindow.matchMedia).toHaveBeenCalledWith(query)
        expect(result).toBe(true)
      })
    })
  })

  describe('getViewportWidth', () => {
    it('should return the larger of documentElement.clientWidth and window.innerWidth', () => {
      // documentElement.clientWidth (1200) > window.innerWidth (1024)
      const result = BrowserService.getViewportWidth()
      expect(result).toBe(1200)
    })

    it('should return window.innerWidth when it is larger', () => {
      mockDocument.documentElement.clientWidth = 800
      mockWindow.innerWidth = 1024

      const result = BrowserService.getViewportWidth()
      expect(result).toBe(1024)
    })

    it('should handle null/undefined values', () => {
      mockDocument.documentElement.clientWidth = null as any
      mockWindow.innerWidth = 1024

      const result = BrowserService.getViewportWidth()
      expect(result).toBe(1024)
    })

    it('should return 0 when both values are null/undefined', () => {
      mockDocument.documentElement.clientWidth = null as any
      mockWindow.innerWidth = null as any

      const result = BrowserService.getViewportWidth()
      expect(result).toBe(0)
    })

    it('should return 0 when an error occurs', () => {
      // Remove document to trigger error
      global.document = null as any

      const result = BrowserService.getViewportWidth()
      expect(result).toBe(0)
    })
  })

  describe('getViewportHeight', () => {
    it('should return the larger of documentElement.clientHeight and window.innerHeight', () => {
      // documentElement.clientHeight (800) > window.innerHeight (768)
      const result = BrowserService.getViewportHeight()
      expect(result).toBe(800)
    })

    it('should return window.innerHeight when it is larger', () => {
      mockDocument.documentElement.clientHeight = 600
      mockWindow.innerHeight = 768

      const result = BrowserService.getViewportHeight()
      expect(result).toBe(768)
    })

    it('should handle null/undefined values', () => {
      mockDocument.documentElement.clientHeight = null as any
      mockWindow.innerHeight = 768

      const result = BrowserService.getViewportHeight()
      expect(result).toBe(768)
    })

    it('should return 0 when both values are null/undefined', () => {
      mockDocument.documentElement.clientHeight = null as any
      mockWindow.innerHeight = null as any

      const result = BrowserService.getViewportHeight()
      expect(result).toBe(0)
    })

    it('should return 0 when an error occurs', () => {
      // Remove document to trigger error
      global.document = null as any

      const result = BrowserService.getViewportHeight()
      expect(result).toBe(0)
    })
  })

  describe('isInIframe', () => {
    it('should return false when not in an iframe', () => {
      // window.self === window.top (not in iframe)
      mockWindow.self = mockWindow
      mockWindow.top = mockWindow

      const result = BrowserService.isInIframe()
      expect(result).toBe(false)
    })

    it('should return true when in an iframe', () => {
      // window.self !== window.top (in iframe)
      mockWindow.self = mockWindow
      mockWindow.top = { different: 'window' } as any

      const result = BrowserService.isInIframe()
      expect(result).toBe(true)
    })

    it('should return true when accessing window.top throws an error (cross-origin)', () => {
      // Simulate cross-origin iframe where accessing window.top throws
      Object.defineProperty(mockWindow, 'top', {
        get() {
          throw new Error('Blocked by CORS policy')
        }
      })

      const result = BrowserService.isInIframe()
      expect(result).toBe(true)
    })

    it('should handle different iframe scenarios', () => {
      // Create a fresh mock window for iframe test
      const iframeMockWindow = createMockWindow()
      iframeMockWindow.self = iframeMockWindow
      iframeMockWindow.top = { iframe: 'parent' } as any
      global.window = iframeMockWindow as any

      const result = BrowserService.isInIframe()
      expect(result).toBe(true)

      // Reset for normal window test
      const normalMockWindow = createMockWindow()
      normalMockWindow.self = normalMockWindow
      normalMockWindow.top = normalMockWindow
      global.window = normalMockWindow as any

      const result2 = BrowserService.isInIframe()
      expect(result2).toBe(false)
    })
  })

  describe('error handling edge cases', () => {
    it('should handle complete window object absence', () => {
      // Temporarily remove window object
      const originalWindow = global.window
      global.window = undefined as any

      expect(BrowserService.matchMedia('test')).toBe(false)
      expect(BrowserService.getViewportWidth()).toBe(0)
      expect(BrowserService.getViewportHeight()).toBe(0)
      expect(BrowserService.isInIframe()).toBe(true) // Error case defaults to true

      // Restore window
      global.window = originalWindow
    })

    it('should handle partial window object', () => {
      // Temporarily set partial window object
      const originalWindow = global.window
      const originalDocument = global.document

      global.window = {} as any
      global.document = undefined as any

      expect(BrowserService.matchMedia('test')).toBe(false)
      expect(BrowserService.getViewportWidth()).toBe(0)
      expect(BrowserService.getViewportHeight()).toBe(0)
      expect(BrowserService.isInIframe()).toBe(false) // No error thrown, so returns false

      // Restore originals
      global.window = originalWindow
      global.document = originalDocument
    })
  })
})
