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

  describe('input field detection and allowance', () => {
    let mockInput: HTMLInputElement
    let mockTextarea: HTMLTextAreaElement
    let mockDiv: HTMLDivElement

    beforeEach(() => {
      // Create mock DOM elements
      mockInput = document.createElement('input')
      mockTextarea = document.createElement('textarea')
      mockDiv = document.createElement('div')
    })

    it('should NOT prevent navigation keys in text input fields', () => {
      const textInputTypes = ['text', 'password', 'email', 'search', 'tel', 'url', 'number']

      textInputTypes.forEach((type) => {
        mockInput.type = type
        mockEvent.target = mockInput
        mockEvent.keyCode = 32 // Space key
        mockEvent.key = ' '

        preventKeyboard(mockEvent)

        expect(mockEvent.preventDefault).not.toHaveBeenCalled()

        // Reset for next iteration
        mockEvent.preventDefault.mockClear()
      })
    })

    it('should prevent navigation keys in non-text input fields', () => {
      const nonTextInputTypes = ['button', 'checkbox', 'radio', 'submit', 'reset', 'file', 'hidden']

      nonTextInputTypes.forEach((type) => {
        mockInput.type = type
        mockEvent.target = mockInput
        mockEvent.keyCode = 32 // Space key
        mockEvent.key = ' '

        preventKeyboard(mockEvent)

        expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1)

        // Reset for next iteration
        mockEvent.preventDefault.mockClear()
      })
    })

    it('should NOT prevent navigation keys in textarea elements', () => {
      mockEvent.target = mockTextarea
      mockEvent.keyCode = 32 // Space key
      mockEvent.key = ' '

      preventKeyboard(mockEvent)

      expect(mockEvent.preventDefault).not.toHaveBeenCalled()
    })

    it('should NOT prevent navigation keys in contenteditable elements', () => {
      mockDiv.setAttribute('contenteditable', 'true')
      mockEvent.target = mockDiv
      mockEvent.keyCode = 32 // Space key
      mockEvent.key = ' '

      preventKeyboard(mockEvent)

      expect(mockEvent.preventDefault).not.toHaveBeenCalled()
    })

    it('should prevent navigation keys in non-contenteditable elements', () => {
      mockDiv.setAttribute('contenteditable', 'false')
      mockEvent.target = mockDiv
      mockEvent.keyCode = 32 // Space key
      mockEvent.key = ' '

      preventKeyboard(mockEvent)

      expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1)
    })

    it('should handle null target', () => {
      mockEvent.target = null
      mockEvent.keyCode = 32 // Space key
      mockEvent.key = ' '

      preventKeyboard(mockEvent)

      expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1)
    })

    it('should handle undefined target', () => {
      mockEvent.target = undefined
      mockEvent.keyCode = 32 // Space key
      mockEvent.key = ' '

      preventKeyboard(mockEvent)

      expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1)
    })

    it('should handle elements with uppercase tag names', () => {
      // Simulate element with uppercase tagName (some browsers might do this)
      const mockElement = {
        tagName: 'INPUT',
        type: 'text'
      } as any

      mockEvent.target = mockElement
      mockEvent.keyCode = 32 // Space key
      mockEvent.key = ' '

      preventKeyboard(mockEvent)

      expect(mockEvent.preventDefault).not.toHaveBeenCalled()
    })
  })

  describe('modern event.key support', () => {
    const modernNavigationKeys = [
      { key: ' ', name: 'Space' },
      { key: 'PageUp', name: 'Page Up' },
      { key: 'PageDown', name: 'Page Down' },
      { key: 'End', name: 'End' },
      { key: 'Home', name: 'Home' },
      { key: 'ArrowLeft', name: 'Arrow Left' },
      { key: 'ArrowUp', name: 'Arrow Up' },
      { key: 'ArrowRight', name: 'Arrow Right' },
      { key: 'ArrowDown', name: 'Arrow Down' }
    ]

    modernNavigationKeys.forEach(({ key, name }) => {
      it(`should prevent default for modern ${name} key using event.key`, () => {
        mockEvent.key = key
        mockEvent.keyCode = undefined // No legacy keyCode

        preventKeyboard(mockEvent)

        expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1)
      })
    })

    it('should NOT prevent non-navigation keys using event.key', () => {
      const nonNavigationKeys = ['Enter', 'Escape', 'Tab', 'a', 'A', '1', 'F1', 'Shift']

      nonNavigationKeys.forEach((key) => {
        mockEvent.key = key
        mockEvent.keyCode = undefined

        preventKeyboard(mockEvent)

        expect(mockEvent.preventDefault).not.toHaveBeenCalled()

        // Reset for next iteration
        mockEvent.preventDefault.mockClear()
      })
    })

    it('should work when both event.key and keyCode are present and match', () => {
      mockEvent.key = ' '
      mockEvent.keyCode = 32

      preventKeyboard(mockEvent)

      expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1)
    })

    it('should work when only event.key matches (no keyCode)', () => {
      mockEvent.key = 'ArrowUp'
      mockEvent.keyCode = undefined

      preventKeyboard(mockEvent)

      expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1)
    })

    it('should work when only keyCode matches (no event.key)', () => {
      mockEvent.key = undefined
      mockEvent.keyCode = 38 // Arrow Up

      preventKeyboard(mockEvent)

      expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1)
    })
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
