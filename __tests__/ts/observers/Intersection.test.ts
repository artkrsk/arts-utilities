import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Intersection } from '../../../src/ts/core/observers/intersection/Intersection'

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
const mockObserve = vi.fn()
const mockDisconnect = vi.fn()

beforeEach(() => {
  // Reset mocks
  mockIntersectionObserver.mockClear()
  mockObserve.mockClear()
  mockDisconnect.mockClear()

  // Mock IntersectionObserver
  mockIntersectionObserver.mockImplementation((callback) => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
    callback
  }))

  // Set up global IntersectionObserver
  global.IntersectionObserver = mockIntersectionObserver
  global.window = global.window || {}
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Intersection', () => {
  describe('Constructor', () => {
    it('should create instance without initializing when no callbacks provided', () => {
      const mockElement = document.createElement('div')
      const intersection = new Intersection({
        elements: [mockElement]
      })

      expect(intersection).toBeDefined()
      expect(mockIntersectionObserver).not.toHaveBeenCalled()
    })

    it('should auto-initialize when elements and callbacks provided', () => {
      const mockElement = document.createElement('div')
      const mockCallback = vi.fn()

      const intersection = new Intersection({
        elements: [mockElement],
        callbackIntersect: mockCallback
      })

      expect(mockIntersectionObserver).toHaveBeenCalledTimes(1)
      expect(mockObserve).toHaveBeenCalledWith(mockElement)
    })

    it('should not initialize when elements array is empty', () => {
      const mockCallback = vi.fn()

      const intersection = new Intersection({
        elements: [],
        callbackIntersect: mockCallback
      })

      expect(mockIntersectionObserver).not.toHaveBeenCalled()
    })
  })

  describe('init()', () => {
    it('should initialize IntersectionObserver when called manually', () => {
      const mockElement = document.createElement('div')
      const mockCallback = vi.fn()

      const intersection = new Intersection({
        elements: [mockElement],
        callbackIntersect: mockCallback
      })

      expect(mockIntersectionObserver).toHaveBeenCalledTimes(1)
    })

    it('should prevent double initialization', () => {
      const mockElement = document.createElement('div')
      const mockCallback = vi.fn()

      const intersection = new Intersection({
        elements: [mockElement],
        callbackIntersect: mockCallback
      })

      // Call init again
      intersection.init()

      // Should still only be called once from constructor
      expect(mockIntersectionObserver).toHaveBeenCalledTimes(1)
    })

    it('should handle IntersectionObserver creation failure gracefully', () => {
      const mockElement = document.createElement('div')
      const mockCallback = vi.fn()

      // Mock IntersectionObserver to throw error
      global.IntersectionObserver = vi.fn().mockImplementation(() => {
        throw new Error('IntersectionObserver not supported')
      })

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const intersection = new Intersection({
        elements: [mockElement],
        callbackIntersect: mockCallback
      })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Intersection: Error creating IntersectionObserver:',
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })

    it('should handle manual init when IntersectionObserver creation fails', () => {
      const mockElement = document.createElement('div')
      const mockCallback = vi.fn()

      // Create intersection without auto-init
      const intersection = new Intersection({
        elements: [],
        callbackIntersect: mockCallback
      })

      // Mock IntersectionObserver to throw error
      global.IntersectionObserver = vi.fn().mockImplementation(() => {
        throw new Error('IntersectionObserver not supported')
      })

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Manually set elements and try to init
      intersection['elements'] = [mockElement]
      intersection.init()

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Intersection: Error creating IntersectionObserver:',
        expect.any(Error)
      )

      // Should not throw when trying to observe elements with null instance
      expect(() => intersection['observeElements']()).not.toThrow()

      consoleErrorSpy.mockRestore()
    })
  })

  describe('destroy()', () => {
    it('should disconnect observer and clean up', () => {
      const mockElement = document.createElement('div')
      const mockCallback = vi.fn()

      const intersection = new Intersection({
        elements: [mockElement],
        callbackIntersect: mockCallback
      })

      intersection.destroy()

      expect(mockDisconnect).toHaveBeenCalledTimes(1)
    })

    it('should handle destroy when no observer exists', () => {
      const intersection = new Intersection({
        elements: []
      })

      // Should not throw error
      expect(() => intersection.destroy()).not.toThrow()
    })

    it('should handle destroy after failed initialization', () => {
      const mockElement = document.createElement('div')
      const mockCallback = vi.fn()

      // Mock IntersectionObserver to return null (failed creation)
      global.IntersectionObserver = vi.fn().mockImplementation(() => {
        throw new Error('IntersectionObserver not supported')
      })

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const intersection = new Intersection({
        elements: [mockElement],
        callbackIntersect: mockCallback
      })

      // Should not throw error when destroying a failed instance
      expect(() => intersection.destroy()).not.toThrow()

      consoleErrorSpy.mockRestore()
    })
  })

  describe('Callback handling', () => {
    it('should call onIntersect callback for intersecting elements', () => {
      const mockElement = document.createElement('div')
      const mockCallback = vi.fn()
      let observerCallback: Function

      mockIntersectionObserver.mockImplementation((callback) => {
        observerCallback = callback
        return {
          observe: mockObserve,
          disconnect: mockDisconnect
        }
      })

      const intersection = new Intersection({
        elements: [mockElement],
        callbackIntersect: mockCallback
      })

      // Simulate intersection
      const mockEntries = [
        {
          target: mockElement,
          isIntersecting: true,
          intersectionRatio: 0.5
        }
      ]

      observerCallback!(mockEntries)

      expect(mockCallback).toHaveBeenCalledWith([mockElement], mockEntries)
    })

    it('should call onIntersectDebounced callback for intersecting elements', () => {
      const mockElement = document.createElement('div')
      const mockCallback = vi.fn()
      const mockDebouncedCallback = vi.fn()
      let observerCallback: Function

      mockIntersectionObserver.mockImplementation((callback) => {
        observerCallback = callback
        return {
          observe: mockObserve,
          disconnect: mockDisconnect
        }
      })

      const intersection = new Intersection({
        elements: [mockElement],
        callbackIntersect: mockCallback,
        callbackIntersectDebounced: mockDebouncedCallback
      })

      // Simulate intersection
      const mockEntries = [
        {
          target: mockElement,
          isIntersecting: true,
          intersectionRatio: 0.5
        }
      ]

      observerCallback!(mockEntries)

      expect(mockCallback).toHaveBeenCalledWith([mockElement], mockEntries)
      expect(mockDebouncedCallback).toHaveBeenCalledWith([mockElement], mockEntries)
    })

    it('should call offIntersect callback for non-intersecting elements', () => {
      const mockElement = document.createElement('div')
      const mockOnCallback = vi.fn()
      const mockOffCallback = vi.fn()
      let observerCallback: Function

      mockIntersectionObserver.mockImplementation((callback) => {
        observerCallback = callback
        return {
          observe: mockObserve,
          disconnect: mockDisconnect
        }
      })

      const intersection = new Intersection({
        elements: [mockElement],
        callbackIntersect: mockOnCallback,
        callbackOffIntersect: mockOffCallback
      })

      // Simulate non-intersection
      const mockEntries = [
        {
          target: mockElement,
          isIntersecting: false,
          intersectionRatio: 0
        }
      ]

      observerCallback!(mockEntries)

      expect(mockOffCallback).toHaveBeenCalledWith([mockElement], mockEntries)
      expect(mockOnCallback).not.toHaveBeenCalled()
    })

    it('should call offIntersectDebounced callback for non-intersecting elements', () => {
      const mockElement = document.createElement('div')
      const mockOnCallback = vi.fn()
      const mockOffCallback = vi.fn()
      const mockOffDebouncedCallback = vi.fn()
      let observerCallback: Function

      mockIntersectionObserver.mockImplementation((callback) => {
        observerCallback = callback
        return {
          observe: mockObserve,
          disconnect: mockDisconnect
        }
      })

      const intersection = new Intersection({
        elements: [mockElement],
        callbackIntersect: mockOnCallback,
        callbackOffIntersect: mockOffCallback,
        callbackOffIntersectDebounced: mockOffDebouncedCallback
      })

      // Simulate non-intersection
      const mockEntries = [
        {
          target: mockElement,
          isIntersecting: false,
          intersectionRatio: 0
        }
      ]

      observerCallback!(mockEntries)

      expect(mockOffCallback).toHaveBeenCalledWith([mockElement], mockEntries)
      expect(mockOffDebouncedCallback).toHaveBeenCalledWith([mockElement], mockEntries)
      expect(mockOnCallback).not.toHaveBeenCalled()
    })

    it('should separate intersecting and non-intersecting entries', () => {
      const mockElement1 = document.createElement('div')
      const mockElement2 = document.createElement('div')
      const mockOnCallback = vi.fn()
      const mockOffCallback = vi.fn()
      let observerCallback: Function

      mockIntersectionObserver.mockImplementation((callback) => {
        observerCallback = callback
        return {
          observe: mockObserve,
          disconnect: mockDisconnect
        }
      })

      const intersection = new Intersection({
        elements: [mockElement1, mockElement2],
        callbackIntersect: mockOnCallback,
        callbackOffIntersect: mockOffCallback
      })

      // Simulate mixed intersection states
      const mockEntries = [
        {
          target: mockElement1,
          isIntersecting: true,
          intersectionRatio: 0.8
        },
        {
          target: mockElement2,
          isIntersecting: false,
          intersectionRatio: 0
        }
      ]

      observerCallback!(mockEntries)

      expect(mockOnCallback).toHaveBeenCalledWith([mockElement1], [mockEntries[0]])
      expect(mockOffCallback).toHaveBeenCalledWith([mockElement2], [mockEntries[1]])
    })

    it('should handle empty intersecting entries gracefully', () => {
      const mockElement = document.createElement('div')
      const mockOnCallback = vi.fn()
      const mockOffCallback = vi.fn()
      let observerCallback: Function

      mockIntersectionObserver.mockImplementation((callback) => {
        observerCallback = callback
        return {
          observe: mockObserve,
          disconnect: mockDisconnect
        }
      })

      const intersection = new Intersection({
        elements: [mockElement],
        callbackIntersect: mockOnCallback,
        callbackOffIntersect: mockOffCallback
      })

      // Simulate empty entries array
      const mockEntries: any[] = []

      observerCallback!(mockEntries)

      expect(mockOnCallback).not.toHaveBeenCalled()
      expect(mockOffCallback).not.toHaveBeenCalled()
    })

    it('should only call debounced callbacks when provided', () => {
      const mockElement = document.createElement('div')
      const mockOnCallback = vi.fn()
      const mockOnDebouncedCallback = vi.fn()
      let observerCallback: Function

      mockIntersectionObserver.mockImplementation((callback) => {
        observerCallback = callback
        return {
          observe: mockObserve,
          disconnect: mockDisconnect
        }
      })

      const intersection = new Intersection({
        elements: [mockElement],
        callbackIntersectDebounced: mockOnDebouncedCallback
      })

      // Simulate intersection
      const mockEntries = [
        {
          target: mockElement,
          isIntersecting: true,
          intersectionRatio: 0.5
        }
      ]

      observerCallback!(mockEntries)

      expect(mockOnDebouncedCallback).toHaveBeenCalledWith([mockElement], mockEntries)
      expect(mockOnCallback).not.toHaveBeenCalled()
    })
  })

  describe('Element validation', () => {
    it('should skip invalid elements during observation', () => {
      const mockElement = document.createElement('div')
      const invalidElement = { notAnElement: true } as any
      const mockCallback = vi.fn()

      const intersection = new Intersection({
        elements: [mockElement, invalidElement],
        callbackIntersect: mockCallback
      })

      // Should only observe the valid element
      expect(mockObserve).toHaveBeenCalledTimes(1)
      expect(mockObserve).toHaveBeenCalledWith(mockElement)
    })

    it('should handle mixed valid and invalid elements', () => {
      const validElement1 = document.createElement('div')
      const validElement2 = document.createElement('span')
      const invalidElement1 = null as any
      const invalidElement2 = 'not an element' as any
      const mockCallback = vi.fn()

      const intersection = new Intersection({
        elements: [validElement1, invalidElement1, validElement2, invalidElement2],
        callbackIntersect: mockCallback
      })

      // Should only observe the valid elements
      expect(mockObserve).toHaveBeenCalledTimes(2)
      expect(mockObserve).toHaveBeenCalledWith(validElement1)
      expect(mockObserve).toHaveBeenCalledWith(validElement2)
    })
  })

  describe('Constructor edge cases', () => {
    it('should not auto-initialize with only debounced callbacks when no regular callbacks', () => {
      const mockElement = document.createElement('div')
      const mockDebouncedCallback = vi.fn()

      const intersection = new Intersection({
        elements: [mockElement],
        callbackIntersectDebounced: mockDebouncedCallback
      })

      expect(mockIntersectionObserver).toHaveBeenCalledTimes(1)
      expect(mockObserve).toHaveBeenCalledWith(mockElement)
    })

    it('should not auto-initialize with only off-debounced callbacks', () => {
      const mockElement = document.createElement('div')
      const mockOffDebouncedCallback = vi.fn()

      const intersection = new Intersection({
        elements: [mockElement],
        callbackOffIntersectDebounced: mockOffDebouncedCallback
      })

      expect(mockIntersectionObserver).toHaveBeenCalledTimes(1)
      expect(mockObserve).toHaveBeenCalledWith(mockElement)
    })

    it('should handle constructor with all callback types', () => {
      const mockElement = document.createElement('div')
      const mockOnCallback = vi.fn()
      const mockOnDebouncedCallback = vi.fn()
      const mockOffCallback = vi.fn()
      const mockOffDebouncedCallback = vi.fn()

      const intersection = new Intersection({
        elements: [mockElement],
        callbackIntersect: mockOnCallback,
        callbackIntersectDebounced: mockOnDebouncedCallback,
        callbackOffIntersect: mockOffCallback,
        callbackOffIntersectDebounced: mockOffDebouncedCallback
      })

      expect(mockIntersectionObserver).toHaveBeenCalledTimes(1)
      expect(mockObserve).toHaveBeenCalledWith(mockElement)
    })
  })

  describe('Environment checks', () => {
    it('should handle missing IntersectionObserver gracefully', () => {
      const mockElement = document.createElement('div')
      const mockCallback = vi.fn()

      // Remove IntersectionObserver
      delete (global as any).IntersectionObserver

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const intersection = new Intersection({
        elements: [mockElement],
        callbackIntersect: mockCallback
      })

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Intersection: IntersectionObserver is not available.'
      )

      consoleWarnSpy.mockRestore()
    })

    it('should handle server-side rendering (no window)', () => {
      const mockElement = document.createElement('div')
      const mockCallback = vi.fn()

      // Remove window
      delete (global as any).window

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const intersection = new Intersection({
        elements: [mockElement],
        callbackIntersect: mockCallback
      })

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Intersection: IntersectionObserver is not available.'
      )

      consoleWarnSpy.mockRestore()
    })
  })

  describe('Options handling', () => {
    it('should pass options to IntersectionObserver', () => {
      const mockElement = document.createElement('div')
      const mockCallback = vi.fn()
      const options = {
        root: null,
        rootMargin: '10px',
        threshold: 0.5
      }

      const intersection = new Intersection({
        elements: [mockElement],
        callbackIntersect: mockCallback,
        options
      })

      expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), options)
    })

    it('should use default empty options when none provided', () => {
      const mockElement = document.createElement('div')
      const mockCallback = vi.fn()

      const intersection = new Intersection({
        elements: [mockElement],
        callbackIntersect: mockCallback
      })

      expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {})
    })
  })
})
