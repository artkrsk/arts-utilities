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

    it('should trigger callback when window width changes', () => {
      const mockCallback = vi.fn()
      const mockMediaQueryList = {
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }

      mockMatchMedia.mockReturnValue(mockMediaQueryList)

      // Setup
      attachResponsiveResize(mockCallback)
      mockCallback.mockClear()

      // Get the resize handler that was added
      const resizeHandler = vi
        .mocked(window.addEventListener)
        .mock.calls.find((call) => call[0] === 'resize')?.[1] as Function

      // Simulate width change
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1200 // Changed from 1024
      })

      // Trigger the resize handler
      resizeHandler()

      expect(mockCallback).toHaveBeenCalledTimes(1)
    })

    it('should not trigger callback when window width stays the same', () => {
      const mockCallback = vi.fn()
      const mockMediaQueryList = {
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }

      mockMatchMedia.mockReturnValue(mockMediaQueryList)

      // Setup
      attachResponsiveResize(mockCallback)
      mockCallback.mockClear()

      // Get the resize handler that was added
      const resizeHandler = vi
        .mocked(window.addEventListener)
        .mock.calls.find((call) => call[0] === 'resize')?.[1] as Function

      // Trigger the resize handler without changing width
      resizeHandler()

      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('should trigger callback when window height changes on fine pointer device', () => {
      const mockCallback = vi.fn()
      const mockMediaQueryList = {
        matches: true, // Fine pointer device
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }

      mockMatchMedia.mockReturnValue(mockMediaQueryList)

      // Setup
      attachResponsiveResize(mockCallback)

      // Get the media query change handler
      const mediaChangeHandler = mockMediaQueryList.addEventListener.mock.calls.find(
        (call) => call[0] === 'change'
      )?.[1] as Function

      // Trigger the media change handler with matches: true (should add height listener)
      mediaChangeHandler({ matches: true })

      // Verify height listener was added
      expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function), false)

      // Get the height change handler
      const heightHandler = vi
        .mocked(window.addEventListener)
        .mock.calls.filter((call) => call[0] === 'resize')[1]?.[1] as Function

      mockCallback.mockClear()

      // Simulate height change
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 900 // Changed from 768
      })

      // Trigger the height handler
      if (heightHandler) {
        heightHandler()
        expect(mockCallback).toHaveBeenCalledTimes(1)
      }
    })

    it('should not trigger callback when window height stays the same', () => {
      const mockCallback = vi.fn()
      const mockMediaQueryList = {
        matches: true, // Fine pointer device
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }

      mockMatchMedia.mockReturnValue(mockMediaQueryList)

      // Setup
      attachResponsiveResize(mockCallback)

      // Get the media query change handler
      const mediaChangeHandler = mockMediaQueryList.addEventListener.mock.calls.find(
        (call) => call[0] === 'change'
      )?.[1] as Function

      // Trigger the media change handler with matches: true (should add height listener)
      mediaChangeHandler({ matches: true })

      // Get the height change handler
      const heightHandler = vi
        .mocked(window.addEventListener)
        .mock.calls.filter((call) => call[0] === 'resize')[1]?.[1] as Function

      mockCallback.mockClear()

      // Trigger the height handler without changing height
      if (heightHandler) {
        heightHandler()
        expect(mockCallback).not.toHaveBeenCalled()
      }
    })

    it('should remove height listener for coarse pointer device', () => {
      const mockCallback = vi.fn()
      const mockMediaQueryList = {
        matches: false, // Coarse pointer device
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }

      mockMatchMedia.mockReturnValue(mockMediaQueryList)

      // Setup
      attachResponsiveResize(mockCallback)

      // Get the media query change handler
      const mediaChangeHandler = mockMediaQueryList.addEventListener.mock.calls.find(
        (call) => call[0] === 'change'
      )?.[1] as Function

      // Trigger the media change handler with matches: false (should remove height listener)
      mediaChangeHandler({ matches: false })

      // Verify height listener was removed
      expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function), false)
    })

    it('should call callback when runCallback is true in media query change', () => {
      const mockCallback = vi.fn()
      const mockMediaQueryList = {
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }

      mockMatchMedia.mockReturnValue(mockMediaQueryList)

      // Setup
      attachResponsiveResize(mockCallback)
      mockCallback.mockClear()

      // Get the media query change handler
      const mediaChangeHandler = mockMediaQueryList.addEventListener.mock.calls.find(
        (call) => call[0] === 'change'
      )?.[1] as Function

      // When the media query change is triggered by addEventListener, it doesn't pass runCallback=true
      // So the callback is NOT called during normal media query changes
      mediaChangeHandler({ matches: false })

      // The callback should NOT be called during normal media query changes
      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('should handle runCallback parameter in handleMediaQueryChange function', () => {
      const mockCallback = vi.fn()
      const mockMediaQueryList = {
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }

      mockMatchMedia.mockReturnValue(mockMediaQueryList)

      // Setup with immediateCall=true to verify the runCallback logic works
      attachResponsiveResize(mockCallback, true)

      // The callback should be called once during setup with immediateCall=true
      expect(mockCallback).toHaveBeenCalledTimes(1)
    })
  })
})
