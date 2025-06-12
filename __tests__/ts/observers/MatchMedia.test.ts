import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MatchMedia } from '../../../src/ts/core/observers/matchMedia/MatchMedia'

// Mock MediaQueryList
class MockMediaQueryList {
  matches: boolean
  addEventListener: any
  removeEventListener: any
  addListener: any
  removeListener: any

  constructor(matches = false) {
    this.matches = matches
    this.addEventListener = vi.fn()
    this.removeEventListener = vi.fn()
    this.addListener = vi.fn()
    this.removeListener = vi.fn()
  }

  simulateChange(matches: boolean) {
    this.matches = matches
    // Simulate both old and new API
    const event = { matches }
    this.addEventListener.mock.calls.forEach(([, handler]) => handler(event))
    this.addListener.mock.calls.forEach(([handler]) => handler(event))
  }
}

describe('MatchMedia', () => {
  let mockMatchMedia: any
  let mockMediaQueryList: MockMediaQueryList
  let consoleWarnSpy: any
  let consoleErrorSpy: any

  beforeEach(() => {
    mockMediaQueryList = new MockMediaQueryList()
    mockMatchMedia = vi.fn(() => mockMediaQueryList)

    // Mock global window
    global.window = {
      matchMedia: mockMatchMedia
    } as any

    // Spy on console methods
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('constructor', () => {
    it('should create instance with condition and callbacks', () => {
      const matchCallback = vi.fn()
      const noMatchCallback = vi.fn()

      const instance = new MatchMedia({
        condition: '(max-width: 768px)',
        callbackMatch: matchCallback,
        callbackNoMatch: noMatchCallback
      })

      expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 768px)')
    })

    it('should create instance with only match callback', () => {
      const matchCallback = vi.fn()

      const instance = new MatchMedia({
        condition: '(min-width: 1024px)',
        callbackMatch: matchCallback
      })

      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 1024px)')
    })

    it('should create instance with only no-match callback', () => {
      const noMatchCallback = vi.fn()

      const instance = new MatchMedia({
        condition: '(orientation: portrait)',
        callbackNoMatch: noMatchCallback
      })

      expect(mockMatchMedia).toHaveBeenCalledWith('(orientation: portrait)')
    })

    it('should not initialize when no callbacks provided', () => {
      const instance = new MatchMedia({
        condition: '(max-width: 768px)'
      })

      expect(mockMatchMedia).not.toHaveBeenCalled()
    })
  })

  describe('init', () => {
    it('should initialize and check initial state when matches is true', () => {
      mockMediaQueryList.matches = true
      const matchCallback = vi.fn()

      const instance = new MatchMedia({
        condition: '(max-width: 768px)',
        callbackMatch: matchCallback
      })

      expect(matchCallback).toHaveBeenCalledTimes(1)
    })

    it('should initialize and check initial state when matches is false', () => {
      mockMediaQueryList.matches = false
      const noMatchCallback = vi.fn()

      const instance = new MatchMedia({
        condition: '(max-width: 768px)',
        callbackNoMatch: noMatchCallback
      })

      expect(noMatchCallback).toHaveBeenCalledTimes(1)
    })

    it('should not re-initialize if already initialized', () => {
      const matchCallback = vi.fn()
      const instance = new MatchMedia({
        condition: '(max-width: 768px)',
        callbackMatch: matchCallback
      })

      mockMatchMedia.mockClear()
      instance.init()

      expect(mockMatchMedia).not.toHaveBeenCalled()
    })

    it('should handle environment where window is undefined', () => {
      global.window = undefined as any

      const matchCallback = vi.fn()
      const instance = new MatchMedia({
        condition: '(max-width: 768px)',
        callbackMatch: matchCallback
      })

      expect(consoleWarnSpy).toHaveBeenCalledWith('MatchMedia: window.matchMedia is not available.')
      expect(matchCallback).not.toHaveBeenCalled()
    })

    it('should handle environment where matchMedia is not a function', () => {
      global.window = { matchMedia: null } as any

      const matchCallback = vi.fn()
      const instance = new MatchMedia({
        condition: '(max-width: 768px)',
        callbackMatch: matchCallback
      })

      expect(consoleWarnSpy).toHaveBeenCalledWith('MatchMedia: window.matchMedia is not available.')
      expect(matchCallback).not.toHaveBeenCalled()
    })

    it('should handle errors from window.matchMedia', () => {
      mockMatchMedia.mockImplementation(() => {
        throw new Error('MediaQuery error')
      })

      const matchCallback = vi.fn()
      const instance = new MatchMedia({
        condition: 'invalid-query',
        callbackMatch: matchCallback
      })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'MatchMedia: Error creating MediaQueryList:',
        expect.any(Error)
      )
      expect(matchCallback).not.toHaveBeenCalled()
    })

    it('should handle when matchMedia returns null', () => {
      // Mock matchMedia to return null
      global.window.matchMedia = vi.fn(() => null as any)

      const matchCallback = vi.fn()
      const noMatchCallback = vi.fn()

      // Should not throw and should not call callbacks
      expect(() => {
        new MatchMedia({
          condition: '(max-width: 768px)',
          callbackMatch: matchCallback,
          callbackNoMatch: noMatchCallback
        })
      }).not.toThrow()

      // Callbacks should not be called when mediaQuery is null
      expect(matchCallback).not.toHaveBeenCalled()
      expect(noMatchCallback).not.toHaveBeenCalled()
    })

    it('should use Safari compatibility fallback when addEventListener is not available', () => {
      // Create a MediaQueryList that only has the old API
      const safariMediaQueryList = {
        matches: false,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        media: '(max-width: 768px)',
        onchange: null,
        addEventListener: undefined as any,
        removeEventListener: undefined as any,
        dispatchEvent: vi.fn()
      }

      global.window.matchMedia = vi.fn(() => safariMediaQueryList as any)

      const matchCallback = vi.fn()
      const noMatchCallback = vi.fn()

      const instance = new MatchMedia({
        condition: '(max-width: 768px)',
        callbackMatch: matchCallback,
        callbackNoMatch: noMatchCallback
      })

      // Should use addListener instead of addEventListener
      expect(safariMediaQueryList.addListener).toHaveBeenCalledTimes(1)
      expect(safariMediaQueryList.addListener).toHaveBeenCalledWith(expect.any(Function))

      // Initial state should trigger noMatch callback
      expect(noMatchCallback).toHaveBeenCalledTimes(1)
      expect(matchCallback).not.toHaveBeenCalled()
    })

    it('should handle null mediaQuery in internal methods', () => {
      const matchCallback = vi.fn()
      const instance = new MatchMedia({
        condition: '(max-width: 768px)',
        callbackMatch: matchCallback
      })

      // Set mediaQuery to null to test null checks
      ;(instance as any).mediaQuery = null

      // Test checkInitialState with null mediaQuery
      expect(() => {
        ;(instance as any).checkInitialState()
      }).not.toThrow()

      // Test attachEvents with null mediaQuery
      expect(() => {
        ;(instance as any).attachEvents()
      }).not.toThrow()

      // Callback should not be called when mediaQuery is null
      expect(matchCallback).not.toHaveBeenCalled()
    })
  })

  describe('event handling', () => {
    it('should attach event listeners using modern API', () => {
      const matchCallback = vi.fn()

      const instance = new MatchMedia({
        condition: '(max-width: 768px)',
        callbackMatch: matchCallback
      })

      expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      )
      expect(mockMediaQueryList.addListener).not.toHaveBeenCalled()
    })

    it('should attach event listeners using legacy API when modern not available', () => {
      mockMediaQueryList.addEventListener = undefined
      const matchCallback = vi.fn()

      const instance = new MatchMedia({
        condition: '(max-width: 768px)',
        callbackMatch: matchCallback
      })

      expect(mockMediaQueryList.addListener).toHaveBeenCalledWith(expect.any(Function))
    })

    it('should call match callback when media query starts matching', () => {
      mockMediaQueryList.matches = false
      const matchCallback = vi.fn()
      const noMatchCallback = vi.fn()

      const instance = new MatchMedia({
        condition: '(max-width: 768px)',
        callbackMatch: matchCallback,
        callbackNoMatch: noMatchCallback
      })

      // Clear initial calls
      matchCallback.mockClear()
      noMatchCallback.mockClear()

      // Simulate change to matching
      mockMediaQueryList.simulateChange(true)

      expect(matchCallback).toHaveBeenCalledTimes(1)
      expect(noMatchCallback).not.toHaveBeenCalled()
    })

    it('should call no-match callback when media query stops matching', () => {
      mockMediaQueryList.matches = true
      const matchCallback = vi.fn()
      const noMatchCallback = vi.fn()

      const instance = new MatchMedia({
        condition: '(max-width: 768px)',
        callbackMatch: matchCallback,
        callbackNoMatch: noMatchCallback
      })

      // Clear initial calls
      matchCallback.mockClear()
      noMatchCallback.mockClear()

      // Simulate change to not matching
      mockMediaQueryList.simulateChange(false)

      expect(noMatchCallback).toHaveBeenCalledTimes(1)
      expect(matchCallback).not.toHaveBeenCalled()
    })

    it('should handle events with legacy API', () => {
      mockMediaQueryList.addEventListener = undefined
      const matchCallback = vi.fn()

      const instance = new MatchMedia({
        condition: '(max-width: 768px)',
        callbackMatch: matchCallback
      })

      // Clear initial call
      matchCallback.mockClear()

      // Simulate change using legacy API
      const handler = mockMediaQueryList.addListener.mock.calls[0][0]
      handler({ matches: true })

      expect(matchCallback).toHaveBeenCalledTimes(1)
    })

    it('should handle missing matches property in event', () => {
      const matchCallback = vi.fn()
      const instance = new MatchMedia({
        condition: '(max-width: 768px)',
        callbackMatch: matchCallback
      })

      // Clear initial call
      matchCallback.mockClear()

      // Get the event handler
      const handler = mockMediaQueryList.addEventListener.mock.calls[0][1]

      // Call with event missing matches property
      mockMediaQueryList.matches = true
      handler({})

      expect(matchCallback).toHaveBeenCalledTimes(1)
    })
  })

  describe('destroy', () => {
    it('should remove event listeners using modern API', () => {
      const matchCallback = vi.fn()
      const instance = new MatchMedia({
        condition: '(max-width: 768px)',
        callbackMatch: matchCallback
      })

      instance.destroy()

      expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      )
    })

    it('should remove event listeners using legacy API when modern not available', () => {
      mockMediaQueryList.addEventListener = undefined
      mockMediaQueryList.removeEventListener = undefined

      const matchCallback = vi.fn()
      const instance = new MatchMedia({
        condition: '(max-width: 768px)',
        callbackMatch: matchCallback
      })

      instance.destroy()

      expect(mockMediaQueryList.removeListener).toHaveBeenCalledWith(expect.any(Function))
    })

    it('should handle destroy when mediaQuery is null', () => {
      const instance = new MatchMedia({
        condition: '(max-width: 768px)'
      })

      // Should not throw
      expect(() => instance.destroy()).not.toThrow()
    })

    it('should set mediaQuery to null after destroy', () => {
      const matchCallback = vi.fn()
      const instance = new MatchMedia({
        condition: '(max-width: 768px)',
        callbackMatch: matchCallback
      })

      instance.destroy()

      // Verify mediaQuery is null by trying to init again
      mockMatchMedia.mockClear()
      instance.init()

      expect(mockMatchMedia).toHaveBeenCalled() // Should be called again since mediaQuery was nulled
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle callbacks that throw errors', () => {
      // Set matches to true so the match callback will be called
      mockMediaQueryList.matches = true

      const matchCallback = vi.fn(() => {
        throw new Error('Callback error')
      })

      // The constructor should throw when the callback throws during initialization
      expect(() => {
        new MatchMedia({
          condition: '(max-width: 768px)',
          callbackMatch: matchCallback
        })
      }).toThrow('Callback error')

      // Verify the callback was called
      expect(matchCallback).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple rapid changes', () => {
      const matchCallback = vi.fn()
      const noMatchCallback = vi.fn()

      const instance = new MatchMedia({
        condition: '(max-width: 768px)',
        callbackMatch: matchCallback,
        callbackNoMatch: noMatchCallback
      })

      // Clear initial calls
      matchCallback.mockClear()
      noMatchCallback.mockClear()

      // Simulate rapid changes
      mockMediaQueryList.simulateChange(true)
      mockMediaQueryList.simulateChange(false)
      mockMediaQueryList.simulateChange(true)
      mockMediaQueryList.simulateChange(false)

      expect(matchCallback).toHaveBeenCalledTimes(2)
      expect(noMatchCallback).toHaveBeenCalledTimes(2)
    })

    it('should handle missing event listener methods gracefully', () => {
      mockMediaQueryList.addEventListener = undefined
      mockMediaQueryList.addListener = undefined
      mockMediaQueryList.matches = true // Set to true so match callback will be called

      const matchCallback = vi.fn()

      // Should not throw
      expect(() => {
        new MatchMedia({
          condition: '(max-width: 768px)',
          callbackMatch: matchCallback
        })
      }).not.toThrow()

      expect(matchCallback).toHaveBeenCalledTimes(1) // Initial state check should still work
    })
  })

  describe('Edge Cases', () => {
    it('should handle null mediaQuery in checkInitialState', () => {
      const callback = vi.fn()
      const instance = new MatchMedia({
        condition: '(min-width: 768px)',
        callbackMatch: callback
      })

      // Access private property and set to null
      ;(instance as any).mediaQuery = null

      // Call private method directly
      ;(instance as any).checkInitialState()

      // Should not throw and callback should not be called
      expect(callback).not.toHaveBeenCalled()
    })

    it('should handle null mediaQuery in attachEvents', () => {
      const callback = vi.fn()
      const instance = new MatchMedia({
        condition: '(min-width: 768px)',
        callbackMatch: callback
      })

      // Access private property and set to null
      ;(instance as any).mediaQuery = null

      // Call private method directly
      expect(() => {
        ;(instance as any).attachEvents()
      }).not.toThrow()
    })

    it('should use addListener fallback for Safari compatibility', () => {
      const callback = vi.fn()
      const mockMediaQuery = {
        matches: true,
        media: '(min-width: 768px)',
        addListener: vi.fn(),
        removeListener: vi.fn()
        // Note: no addEventListener property to force Safari fallback
      }

      // Mock matchMedia to return our custom object
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockReturnValue(mockMediaQuery)
      })

      const instance = new MatchMedia({
        condition: '(min-width: 768px)',
        callbackMatch: callback
      })

      // Should have used addListener instead of addEventListener
      expect(mockMediaQuery.addListener).toHaveBeenCalledWith(expect.any(Function))
    })
  })
})
