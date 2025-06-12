import { describe, it, expect, vi, beforeEach } from 'vitest'
import { preventDefault } from '../../../src/ts/core/events/PreventDefault'

describe('preventDefault', () => {
  let mockEvent: any

  beforeEach(() => {
    mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn()
    }
  })

  it('should call preventDefault on the event', () => {
    preventDefault(mockEvent)

    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1)
  })

  it('should call stopPropagation on the event', () => {
    preventDefault(mockEvent)

    expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1)
  })

  it('should call both preventDefault and stopPropagation', () => {
    preventDefault(mockEvent)

    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1)
    expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1)
  })

  it('should work with different event types', () => {
    // Test with click event
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault')
    const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation')

    preventDefault(clickEvent)

    expect(preventDefaultSpy).toHaveBeenCalledTimes(1)
    expect(stopPropagationSpy).toHaveBeenCalledTimes(1)
  })

  it('should work with keyboard event', () => {
    const keyEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true })
    const preventDefaultSpy = vi.spyOn(keyEvent, 'preventDefault')
    const stopPropagationSpy = vi.spyOn(keyEvent, 'stopPropagation')

    preventDefault(keyEvent)

    expect(preventDefaultSpy).toHaveBeenCalledTimes(1)
    expect(stopPropagationSpy).toHaveBeenCalledTimes(1)
  })

  it('should work with wheel event', () => {
    const wheelEvent = new WheelEvent('wheel', { bubbles: true, cancelable: true })
    const preventDefaultSpy = vi.spyOn(wheelEvent, 'preventDefault')
    const stopPropagationSpy = vi.spyOn(wheelEvent, 'stopPropagation')

    preventDefault(wheelEvent)

    expect(preventDefaultSpy).toHaveBeenCalledTimes(1)
    expect(stopPropagationSpy).toHaveBeenCalledTimes(1)
  })

  it('should work with touch event', () => {
    const touchEvent = new TouchEvent('touchmove', { bubbles: true, cancelable: true })
    const preventDefaultSpy = vi.spyOn(touchEvent, 'preventDefault')
    const stopPropagationSpy = vi.spyOn(touchEvent, 'stopPropagation')

    preventDefault(touchEvent)

    expect(preventDefaultSpy).toHaveBeenCalledTimes(1)
    expect(stopPropagationSpy).toHaveBeenCalledTimes(1)
  })

  it('should handle events that throw errors on preventDefault', () => {
    const errorEvent = {
      preventDefault: vi.fn(() => {
        throw new Error('Cannot prevent default')
      }),
      stopPropagation: vi.fn()
    }

    expect(() => {
      preventDefault(errorEvent)
    }).toThrow('Cannot prevent default')

    expect(errorEvent.stopPropagation).toHaveBeenCalledTimes(1)
    expect(errorEvent.preventDefault).toHaveBeenCalledTimes(1)
  })

  it('should handle events that throw errors on stopPropagation', () => {
    const errorEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(() => {
        throw new Error('Cannot stop propagation')
      })
    }

    expect(() => {
      preventDefault(errorEvent)
    }).toThrow('Cannot stop propagation')

    expect(errorEvent.preventDefault).toHaveBeenCalledTimes(1)
    expect(errorEvent.stopPropagation).toHaveBeenCalledTimes(1)
  })
})
