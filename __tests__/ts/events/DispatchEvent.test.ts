import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { dispatchEvent } from '../../../src/ts/core/events/DispatchEvent'

describe('dispatchEvent', () => {
  let mockTarget: EventTarget
  let mockDocument: Document

  beforeEach(() => {
    // Mock document and window
    global.window = {
      CustomEvent: CustomEvent
    } as any

    mockDocument = {
      dispatchEvent: vi.fn().mockReturnValue(true)
    } as any

    global.document = mockDocument

    mockTarget = {
      dispatchEvent: vi.fn().mockReturnValue(true)
    } as any
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('basic functionality', () => {
    it('should dispatch a custom event with the given name', () => {
      const result = dispatchEvent('test-event')

      expect(mockDocument.dispatchEvent).toHaveBeenCalledTimes(1)
      expect(result).toBe(true)

      const dispatchedEvent = (mockDocument.dispatchEvent as any).mock.calls[0][0]
      expect(dispatchedEvent).toBeInstanceOf(CustomEvent)
      expect(dispatchedEvent.type).toBe('test-event')
    })

    it('should return the result of target.dispatchEvent', () => {
      // Test when event is not canceled
      ;(mockDocument.dispatchEvent as any).mockReturnValue(true)
      expect(dispatchEvent('test-event')).toBe(true)

      // Test when event is canceled
      ;(mockDocument.dispatchEvent as any).mockReturnValue(false)
      expect(dispatchEvent('test-event')).toBe(false)
    })

    it('should use document as default target', () => {
      dispatchEvent('test-event')

      expect(mockDocument.dispatchEvent).toHaveBeenCalledTimes(1)
      expect(mockTarget.dispatchEvent).not.toHaveBeenCalled()
    })

    it('should use provided target when specified', () => {
      dispatchEvent('test-event', {}, mockTarget)

      expect(mockTarget.dispatchEvent).toHaveBeenCalledTimes(1)
      expect(mockDocument.dispatchEvent).not.toHaveBeenCalled()
    })
  })

  describe('event options', () => {
    it('should use default options when none provided', () => {
      dispatchEvent('test-event')

      const dispatchedEvent = (mockDocument.dispatchEvent as any).mock.calls[0][0]
      expect(dispatchedEvent.bubbles).toBe(true)
      expect(dispatchedEvent.cancelable).toBe(true)
      expect(dispatchedEvent.composed).toBe(false)
    })

    it('should respect custom bubbles option', () => {
      dispatchEvent('test-event', { bubbles: false })

      const dispatchedEvent = (mockDocument.dispatchEvent as any).mock.calls[0][0]
      expect(dispatchedEvent.bubbles).toBe(false)
    })

    it('should respect custom cancelable option', () => {
      dispatchEvent('test-event', { cancelable: false })

      const dispatchedEvent = (mockDocument.dispatchEvent as any).mock.calls[0][0]
      expect(dispatchedEvent.cancelable).toBe(false)
    })

    it('should respect custom composed option', () => {
      dispatchEvent('test-event', { composed: true })

      const dispatchedEvent = (mockDocument.dispatchEvent as any).mock.calls[0][0]
      expect(dispatchedEvent.composed).toBe(true)
    })

    it('should include detail when provided', () => {
      const detail = { userId: 123, action: 'login' }
      dispatchEvent('test-event', { detail })

      const dispatchedEvent = (mockDocument.dispatchEvent as any).mock.calls[0][0]
      expect(dispatchedEvent.detail).toEqual(detail)
    })

    it('should not include detail property when detail is undefined', () => {
      dispatchEvent('test-event', { detail: undefined })

      const dispatchedEvent = (mockDocument.dispatchEvent as any).mock.calls[0][0]
      // CustomEvent sets detail to null when not provided in eventInit
      expect(dispatchedEvent.detail).toBe(null)
    })

    it('should handle null detail', () => {
      dispatchEvent('test-event', { detail: null })

      const dispatchedEvent = (mockDocument.dispatchEvent as any).mock.calls[0][0]
      expect(dispatchedEvent.detail).toBe(null)
    })
  })

  describe('type safety', () => {
    it('should work with typed detail', () => {
      interface LoginDetail {
        userId: number
        username: string
      }

      const detail: LoginDetail = { userId: 123, username: 'john' }
      dispatchEvent<LoginDetail>('user-login', { detail })

      const dispatchedEvent = (mockDocument.dispatchEvent as any).mock.calls[0][0]
      expect(dispatchedEvent.detail).toEqual(detail)
    })
  })

  describe('error handling', () => {
    it('should return false when window is undefined', () => {
      const originalWindow = global.window
      delete (global as any).window

      const result = dispatchEvent('test-event')

      expect(result).toBe(false)
      expect(mockDocument.dispatchEvent).not.toHaveBeenCalled()

      global.window = originalWindow
    })

    it('should return false when CustomEvent is undefined', () => {
      const originalWindow = global.window
      global.window = {} as any

      const result = dispatchEvent('test-event')

      expect(result).toBe(false)
      expect(mockDocument.dispatchEvent).not.toHaveBeenCalled()

      global.window = originalWindow
    })

    it('should return false when target is null and document is not available', () => {
      const originalDocument = global.document

      // Set document to a falsy value that would make eventTarget evaluation fail
      ;(global as any).document = null

      const result = dispatchEvent('test-event', {}, null)

      expect(result).toBe(false)

      global.document = originalDocument
    })

    it('should return false when CustomEvent constructor throws', () => {
      const originalWindow = global.window
      global.window = {
        CustomEvent: vi.fn().mockImplementation(() => {
          throw new Error('CustomEvent failed')
        })
      } as any

      const result = dispatchEvent('test-event')

      expect(result).toBe(false)
      expect(mockDocument.dispatchEvent).not.toHaveBeenCalled()

      global.window = originalWindow
    })

    it('should return false when dispatchEvent throws', () => {
      ;(mockDocument.dispatchEvent as any).mockImplementation(() => {
        throw new Error('Dispatch failed')
      })

      const result = dispatchEvent('test-event')

      expect(result).toBe(false)
    })
  })

  describe('real-world scenarios', () => {
    it('should handle complex event data', () => {
      const eventData = {
        user: { id: 123, name: 'John Doe' },
        timestamp: Date.now(),
        metadata: { source: 'button-click', page: '/dashboard' }
      }

      dispatchEvent('user-action', { detail: eventData })

      const dispatchedEvent = (mockDocument.dispatchEvent as any).mock.calls[0][0]
      expect(dispatchedEvent.detail).toEqual(eventData)
      expect(dispatchedEvent.type).toBe('user-action')
    })

    it('should work with DOM elements as targets', () => {
      const mockElement = {
        dispatchEvent: vi.fn().mockReturnValue(true)
      } as any

      const result = dispatchEvent(
        'modal-open',
        {
          detail: { modalId: 'settings' }
        },
        mockElement
      )

      expect(result).toBe(true)
      expect(mockElement.dispatchEvent).toHaveBeenCalledTimes(1)
      expect(mockDocument.dispatchEvent).not.toHaveBeenCalled()
    })

    it('should handle events that get canceled', () => {
      ;(mockTarget.dispatchEvent as any).mockReturnValue(false)

      const result = dispatchEvent(
        'cancelable-event',
        {
          cancelable: true
        },
        mockTarget
      )

      expect(result).toBe(false)
    })
  })
})
