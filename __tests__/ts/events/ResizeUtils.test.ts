import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { attachResponsiveResize } from '../../../src/ts/core/events/ResizeUtils'

// Mock window.matchMedia
const mockMatchMedia = vi.fn()

describe('ResizeUtils', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia
    })

    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024
    })

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: 768
    })

    // Mock addEventListener and removeEventListener
    vi.spyOn(window, 'addEventListener')
    vi.spyOn(window, 'removeEventListener')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('attachResponsiveResize', () => {
    it('should return cleanup object when invalid callback provided', () => {
      // @ts-ignore - Testing with invalid input
      const result = attachResponsiveResize('not a function')

      expect(result).toHaveProperty('clear')
      expect(typeof result.clear).toBe('function')
    })

    it('should return cleanup object when invalid callback provided', () => {
      // @ts-ignore - Testing with invalid input
      const result = attachResponsiveResize(null)

      expect(result).toHaveProperty('clear')
      expect(typeof result.clear).toBe('function')
    })

    it('should setup event listeners when valid callback provided', () => {
      const mockCallback = vi.fn()
      const mockMediaQueryList = {
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }

      mockMatchMedia.mockReturnValue(mockMediaQueryList)

      const result = attachResponsiveResize(mockCallback, true)

      // Should call matchMedia with correct query
      expect(mockMatchMedia).toHaveBeenCalledWith('(hover: hover) and (pointer: fine)')

      // Should add width resize listener
      expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function), false)

      // Should add media query listener
      expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      )

      // Should call callback immediately if immediateCall is true
      expect(mockCallback).toHaveBeenCalledTimes(1)

      expect(result).toHaveProperty('clear')
    })

    it('should not call callback immediately when immediateCall is false', () => {
      const mockCallback = vi.fn()
      const mockMediaQueryList = {
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }

      mockMatchMedia.mockReturnValue(mockMediaQueryList)

      attachResponsiveResize(mockCallback, false)

      // Should not call callback immediately
      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('should handle legacy matchMedia API', () => {
      const mockCallback = vi.fn()
      const mockMediaQueryList = {
        matches: true,
        addListener: vi.fn(),
        removeListener: vi.fn()
        // No addEventListener/removeEventListener for legacy API
      }

      mockMatchMedia.mockReturnValue(mockMediaQueryList)

      const result = attachResponsiveResize(mockCallback)

      // Should use legacy addListener
      expect(mockMediaQueryList.addListener).toHaveBeenCalledWith(expect.any(Function))

      expect(result).toHaveProperty('clear')
    })

    it('should clean up all event listeners', () => {
      const mockCallback = vi.fn()
      const mockMediaQueryList = {
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }

      mockMatchMedia.mockReturnValue(mockMediaQueryList)

      const { clear } = attachResponsiveResize(mockCallback)

      // Call clear
      clear()

      // Should remove window resize listeners
      expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function), false)

      // Should remove media query listener
      expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      )
    })

    it('should clean up legacy event listeners', () => {
      const mockCallback = vi.fn()
      const mockMediaQueryList = {
        matches: true,
        addListener: vi.fn(),
        removeListener: vi.fn()
        // No addEventListener/removeEventListener for legacy API
      }

      mockMatchMedia.mockReturnValue(mockMediaQueryList)

      const { clear } = attachResponsiveResize(mockCallback)

      // Call clear
      clear()

      // Should use legacy removeListener
      expect(mockMediaQueryList.removeListener).toHaveBeenCalledWith(expect.any(Function))
    })
  })
})
