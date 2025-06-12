import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Resize } from '../../../src/ts/core/observers/resize'

// Mock ResizeObserver
class MockResizeObserver {
  observe: any
  disconnect: any
  callback: any

  constructor(callback: any) {
    this.callback = callback
    this.observe = vi.fn()
    this.disconnect = vi.fn()
  }

  simulateResize(entries: Array<any>) {
    this.callback(entries)
  }
}

// Mock HTMLElement
class MockHTMLElement {
  nodeType = 1
  constructor() {
    this.nodeType = 1
  }
}

describe('Resize', () => {
  let mockResizeObserver: MockResizeObserver
  let mockElements: Array<MockHTMLElement>
  let consoleWarnSpy: any
  let consoleErrorSpy: any
  let originalResizeObserver: any

  beforeEach(() => {
    mockElements = [new MockHTMLElement(), new MockHTMLElement()]

    // Mock global ResizeObserver - create a new instance each time
    originalResizeObserver = global.ResizeObserver
    global.ResizeObserver = vi.fn((callback) => {
      mockResizeObserver = new MockResizeObserver(callback)
      return mockResizeObserver
    }) as any

    // Mock global window
    global.window = {} as any

    // Spy on console methods
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    global.ResizeObserver = originalResizeObserver
  })

  describe('constructor', () => {
    it('should create instance with elements and callbacks', () => {
      const resizeCallback = vi.fn()
      const debouncedCallback = vi.fn()

      const instance = new Resize({
        elements: mockElements as any,
        callbackResize: resizeCallback,
        callbackResizeDebounced: debouncedCallback
      })

      expect(global.ResizeObserver).toHaveBeenCalled()
    })

    it('should create instance with only resize callback', () => {
      const resizeCallback = vi.fn()

      const instance = new Resize({
        elements: mockElements as any,
        callbackResize: resizeCallback
      })

      expect(global.ResizeObserver).toHaveBeenCalled()
    })

    it('should create instance with only debounced callback', () => {
      const debouncedCallback = vi.fn()

      const instance = new Resize({
        elements: mockElements as any,
        callbackResizeDebounced: debouncedCallback
      })

      expect(global.ResizeObserver).toHaveBeenCalled()
    })

    it('should not initialize when no elements provided', () => {
      const resizeCallback = vi.fn()

      const instance = new Resize({
        elements: [],
        callbackResize: resizeCallback
      })

      expect(global.ResizeObserver).not.toHaveBeenCalled()
    })

    it('should not initialize when no callbacks provided', () => {
      const instance = new Resize({
        elements: mockElements as any
      })

      expect(global.ResizeObserver).not.toHaveBeenCalled()
    })
  })

  describe('init', () => {
    it('should initialize and observe elements', () => {
      const resizeCallback = vi.fn()

      const instance = new Resize({
        elements: mockElements as any,
        callbackResize: resizeCallback
      })

      expect(mockResizeObserver.observe).toHaveBeenCalledTimes(2)
      expect(mockResizeObserver.observe).toHaveBeenCalledWith(mockElements[0])
      expect(mockResizeObserver.observe).toHaveBeenCalledWith(mockElements[1])
    })

    it('should not re-initialize if already initialized', () => {
      const resizeCallback = vi.fn()

      const instance = new Resize({
        elements: mockElements as any,
        callbackResize: resizeCallback
      })

      vi.clearAllMocks()

      instance.init()

      expect(global.ResizeObserver).not.toHaveBeenCalled()
    })

    it('should handle environment where window is undefined', () => {
      global.window = undefined as any

      const resizeCallback = vi.fn()

      const instance = new Resize({
        elements: mockElements as any,
        callbackResize: resizeCallback
      })

      expect(consoleWarnSpy).toHaveBeenCalledWith('Resize: ResizeObserver is not available.')
    })

    it('should handle environment where ResizeObserver is not a function', () => {
      global.ResizeObserver = undefined as any

      const resizeCallback = vi.fn()

      const instance = new Resize({
        elements: mockElements as any,
        callbackResize: resizeCallback
      })

      expect(consoleWarnSpy).toHaveBeenCalledWith('Resize: ResizeObserver is not available.')
    })

    it('should handle errors from ResizeObserver constructor', () => {
      global.ResizeObserver = vi.fn(() => {
        throw new Error('ResizeObserver error')
      }) as any

      const resizeCallback = vi.fn()

      const instance = new Resize({
        elements: mockElements as any,
        callbackResize: resizeCallback
      })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Resize: Error creating ResizeObserver:',
        expect.any(Error)
      )
    })

    it('should handle specific ResizeObserver constructor error and cover error handling lines', () => {
      // Mock ResizeObserver to throw an error during construction
      global.ResizeObserver = vi.fn(() => {
        throw new Error('Specific ResizeObserver constructor error')
      }) as any

      const resizeCallback = vi.fn()

      // This should trigger the catch block in createResizeObserver (lines 112-113)
      const instance = new Resize({
        elements: [document.createElement('div')],
        callbackResize: resizeCallback
      })

      // Verify the error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Resize: Error creating ResizeObserver:',
        expect.objectContaining({
          message: 'Specific ResizeObserver constructor error'
        })
      )

      // Verify instance was not created (returned null)
      expect((instance as any).instance).toBeNull()
    })

    it('should filter out non-HTML elements', () => {
      const invalidElements = [
        null,
        undefined,
        'string',
        123,
        {},
        mockElements[0] // Valid element
      ]

      const resizeCallback = vi.fn()

      const instance = new Resize({
        elements: invalidElements as any,
        callbackResize: resizeCallback
      })

      // Should only observe the one valid element
      expect(mockResizeObserver.observe).toHaveBeenCalledTimes(1)
      expect(mockResizeObserver.observe).toHaveBeenCalledWith(mockElements[0])
    })
  })

  describe('event handling', () => {
    it('should call resize callback when elements are resized', () => {
      const resizeCallback = vi.fn()

      const instance = new Resize({
        elements: mockElements as any,
        callbackResize: resizeCallback
      })

      const mockEntries = [{ target: mockElements[0] }, { target: mockElements[1] }]

      mockResizeObserver.simulateResize(mockEntries)

      expect(resizeCallback).toHaveBeenCalledTimes(1)
      expect(resizeCallback).toHaveBeenCalledWith([mockElements[0], mockElements[1]], mockEntries)
    })

    it('should call debounced callback when elements are resized', () => {
      const debouncedCallback = vi.fn()

      const instance = new Resize({
        elements: mockElements as any,
        callbackResizeDebounced: debouncedCallback
      })

      const mockEntries = [{ target: mockElements[0] }]

      mockResizeObserver.simulateResize(mockEntries)

      expect(debouncedCallback).toHaveBeenCalledTimes(1)
      expect(debouncedCallback).toHaveBeenCalledWith([mockElements[0]], mockEntries)
    })

    it('should call both callbacks when both are provided', () => {
      const resizeCallback = vi.fn()
      const debouncedCallback = vi.fn()

      const instance = new Resize({
        elements: mockElements as any,
        callbackResize: resizeCallback,
        callbackResizeDebounced: debouncedCallback
      })

      const mockEntries = [{ target: mockElements[0] }]

      mockResizeObserver.simulateResize(mockEntries)

      expect(resizeCallback).toHaveBeenCalledTimes(1)
      expect(debouncedCallback).toHaveBeenCalledTimes(1)
    })

    it('should handle empty entries array', () => {
      const resizeCallback = vi.fn()

      const instance = new Resize({
        elements: mockElements as any,
        callbackResize: resizeCallback
      })

      mockResizeObserver.simulateResize([])

      expect(resizeCallback).toHaveBeenCalledWith([], [])
    })
  })

  describe('destroy', () => {
    it('should disconnect observer and clean up', () => {
      const resizeCallback = vi.fn()

      const instance = new Resize({
        elements: mockElements as any,
        callbackResize: resizeCallback
      })

      instance.destroy()

      expect(mockResizeObserver.disconnect).toHaveBeenCalledTimes(1)
    })

    it('should handle destroy when instance is null', () => {
      const resizeCallback = vi.fn()

      // Create instance that won't initialize due to missing ResizeObserver
      global.ResizeObserver = undefined as any

      const instance = new Resize({
        elements: mockElements as any,
        callbackResize: resizeCallback
      })

      // Should not throw
      expect(() => {
        instance.destroy()
      }).not.toThrow()
    })

    it('should allow re-initialization after destroy', () => {
      const resizeCallback = vi.fn()

      const instance = new Resize({
        elements: mockElements as any,
        callbackResize: resizeCallback
      })

      instance.destroy()

      vi.clearAllMocks()

      // Should be able to init again
      instance.init()

      expect(global.ResizeObserver).toHaveBeenCalled()
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle multiple rapid resize events', () => {
      const resizeCallback = vi.fn()

      const instance = new Resize({
        elements: mockElements as any,
        callbackResize: resizeCallback
      })

      const mockEntries = [{ target: mockElements[0] }]

      // Simulate rapid resize events
      mockResizeObserver.simulateResize(mockEntries)
      mockResizeObserver.simulateResize(mockEntries)
      mockResizeObserver.simulateResize(mockEntries)

      expect(resizeCallback).toHaveBeenCalledTimes(3)
    })

    it('should handle elements with different types', () => {
      const mixedElements = [
        mockElements[0],
        { nodeType: 3 }, // Text node
        mockElements[1],
        { nodeType: 8 }, // Comment node
        new MockHTMLElement()
      ]

      const resizeCallback = vi.fn()

      const instance = new Resize({
        elements: mixedElements as any,
        callbackResize: resizeCallback
      })

      // Should only observe HTML elements (nodeType 1)
      expect(mockResizeObserver.observe).toHaveBeenCalledTimes(3)
    })

    it('should handle errors in ResizeObserver callback gracefully', () => {
      const callback = vi.fn().mockImplementation(() => {
        throw new Error('Callback error')
      })

      const instance = new Resize({
        elements: [document.createElement('div')],
        callbackResize: callback
      })

      // Get the ResizeObserver callback and simulate an error scenario
      const mockObserver = (global.ResizeObserver as any).mock.calls[0][0]

      // Create mock entry that would trigger the error path
      const mockEntry = {
        target: document.createElement('div'),
        contentRect: { width: 100, height: 100 },
        borderBoxSize: [{ inlineSize: 100, blockSize: 100 }],
        contentBoxSize: [{ inlineSize: 100, blockSize: 100 }],
        devicePixelContentBoxSize: [{ inlineSize: 100, blockSize: 100 }]
      }

      // The observer callback will throw when the user callback throws
      expect(() => {
        mockObserver([mockEntry])
      }).toThrow('Callback error')

      expect(callback).toHaveBeenCalled()
    })

    it('should handle non-HTMLElement in observeElements method', () => {
      // Create a mix of valid and invalid elements
      const validElement = document.createElement('div')
      const invalidElement = {} as HTMLElement // Not actually an HTMLElement

      const callback = vi.fn()

      // Create instance without auto-initialization
      const instance = new Resize({
        elements: [], // Start with empty elements to prevent auto-init
        callbackResize: callback
      })

      // Set elements manually and call observeElements
      ;(instance as any).elements = [validElement, invalidElement]
      ;(instance as any).instance = mockResizeObserver // Set a mock observer

      // Call the private observeElements method
      ;(instance as any).observeElements()

      // Only valid element should be observed
      expect(mockResizeObserver.observe).toHaveBeenCalledTimes(1)
      expect(mockResizeObserver.observe).toHaveBeenCalledWith(validElement)
    })

    it('should return early from observeElements when instance is null', () => {
      const callback = vi.fn()

      // Create instance without auto-initialization
      const instance = new Resize({
        elements: [], // Start with empty elements to prevent auto-init
        callbackResize: callback
      })

      // Set elements but ensure instance is null
      ;(instance as any).elements = [document.createElement('div')]
      ;(instance as any).instance = null // Explicitly set instance to null

      // Spy on the observe method to ensure it's not called
      const observeSpy = vi.fn()
      mockResizeObserver.observe = observeSpy

      // Call the private observeElements method
      ;(instance as any).observeElements()

      // Observe should not have been called since instance is null
      expect(observeSpy).not.toHaveBeenCalled()
    })
  })
})
