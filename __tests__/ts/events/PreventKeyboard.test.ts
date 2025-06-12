import { describe, it, expect, vi, beforeEach } from 'vitest'
import { preventKeyboard } from '../../../src/ts/core/events/PreventKeyboard'

describe('preventKeyboard', () => {
  let mockEvent: any

  beforeEach(() => {
    mockEvent = {
      preventDefault: vi.fn(),
      keyCode: 0
    }
  })

  describe('navigation keys prevention', () => {
    const navigationKeys = [
      { keyCode: 32, name: 'Space' },
      { keyCode: 33, name: 'Page Up' },
      { keyCode: 34, name: 'Page Down' },
      { keyCode: 35, name: 'End' },
      { keyCode: 36, name: 'Home' },
      { keyCode: 37, name: 'Arrow Left' },
      { keyCode: 38, name: 'Arrow Up' },
      { keyCode: 39, name: 'Arrow Right' },
      { keyCode: 40, name: 'Arrow Down' }
    ]

    navigationKeys.forEach(({ keyCode, name }) => {
      it(`should prevent default for ${name} key (${keyCode})`, () => {
        mockEvent.keyCode = keyCode

        preventKeyboard(mockEvent)

        expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('non-navigation keys', () => {
    const nonNavigationKeys = [
      { keyCode: 65, name: 'A' },
      { keyCode: 13, name: 'Enter' },
      { keyCode: 27, name: 'Escape' },
      { keyCode: 9, name: 'Tab' },
      { keyCode: 16, name: 'Shift' },
      { keyCode: 17, name: 'Ctrl' },
      { keyCode: 18, name: 'Alt' },
      { keyCode: 112, name: 'F1' },
      { keyCode: 123, name: 'F12' }
    ]

    nonNavigationKeys.forEach(({ keyCode, name }) => {
      it(`should NOT prevent default for ${name} key (${keyCode})`, () => {
        mockEvent.keyCode = keyCode

        preventKeyboard(mockEvent)

        expect(mockEvent.preventDefault).not.toHaveBeenCalled()
      })
    })
  })

  it('should work with real KeyboardEvent objects', () => {
    // Test with Space key
    const spaceEvent = new KeyboardEvent('keydown', { keyCode: 32 } as any)
    const preventDefaultSpy = vi.spyOn(spaceEvent, 'preventDefault')

    preventKeyboard(spaceEvent)

    expect(preventDefaultSpy).toHaveBeenCalledTimes(1)
  })

  it('should work with real KeyboardEvent for non-navigation key', () => {
    // Test with Enter key
    const enterEvent = new KeyboardEvent('keydown', { keyCode: 13 } as any)
    const preventDefaultSpy = vi.spyOn(enterEvent, 'preventDefault')

    preventKeyboard(enterEvent)

    expect(preventDefaultSpy).not.toHaveBeenCalled()
  })

  it('should handle events with undefined keyCode', () => {
    const eventWithoutKeyCode = {
      preventDefault: vi.fn(),
      keyCode: undefined
    } as any

    expect(() => {
      preventKeyboard(eventWithoutKeyCode)
    }).not.toThrow()

    expect(eventWithoutKeyCode.preventDefault).not.toHaveBeenCalled()
  })

  it('should handle events with null keyCode', () => {
    const eventWithNullKeyCode = {
      preventDefault: vi.fn(),
      keyCode: null
    } as any

    expect(() => {
      preventKeyboard(eventWithNullKeyCode)
    }).not.toThrow()

    expect(eventWithNullKeyCode.preventDefault).not.toHaveBeenCalled()
  })

  it('should handle events with string keyCode', () => {
    const eventWithStringKeyCode = {
      preventDefault: vi.fn(),
      keyCode: '32' // String instead of number
    } as any

    expect(() => {
      preventKeyboard(eventWithStringKeyCode)
    }).not.toThrow()

    expect(eventWithStringKeyCode.preventDefault).not.toHaveBeenCalled()
  })

  it('should handle boundary key codes', () => {
    // Test just below the range
    mockEvent.keyCode = 31
    preventKeyboard(mockEvent)
    expect(mockEvent.preventDefault).not.toHaveBeenCalled()

    // Reset mock
    mockEvent.preventDefault.mockClear()

    // Test just above the range
    mockEvent.keyCode = 41
    preventKeyboard(mockEvent)
    expect(mockEvent.preventDefault).not.toHaveBeenCalled()
  })

  it('should handle event that throws error on preventDefault', () => {
    const errorEvent = {
      keyCode: 32, // Space key
      preventDefault: vi.fn(() => {
        throw new Error('Cannot prevent default')
      })
    } as any

    expect(() => {
      preventKeyboard(errorEvent)
    }).toThrow('Cannot prevent default')

    expect(errorEvent.preventDefault).toHaveBeenCalledTimes(1)
  })
})
