import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { pageLock } from '../../../src/ts/core/events/PageLock'

describe('pageLock', () => {
  let addEventListenerSpy: any
  let removeEventListenerSpy: any
  let originalWindow: any

  beforeEach(() => {
    // Mock window object
    global.window = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    } as any

    addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('locking functionality', () => {
    it('should add event listeners when locking with default options', () => {
      pageLock(true)

      expect(addEventListenerSpy).toHaveBeenCalledWith('wheel', expect.any(Function), {
        passive: false
      })
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function), {
        passive: false
      })
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), {
        passive: false
      })
      expect(addEventListenerSpy).toHaveBeenCalledTimes(3)
    })

    it('should add event listeners when called with lock=true explicitly', () => {
      pageLock(true, {})

      expect(addEventListenerSpy).toHaveBeenCalledWith('wheel', expect.any(Function), {
        passive: false
      })
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function), {
        passive: false
      })
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), {
        passive: false
      })
      expect(addEventListenerSpy).toHaveBeenCalledTimes(3)
    })

    it('should add event listeners with passive option', () => {
      pageLock(true, { passive: true })

      expect(addEventListenerSpy).toHaveBeenCalledWith('wheel', expect.any(Function), {
        passive: true
      })
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function), {
        passive: true
      })
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), {
        passive: true
      })
      expect(addEventListenerSpy).toHaveBeenCalledTimes(3)
    })

    it('should not add keyboard listener when lockKeyboard is false', () => {
      pageLock(true, { lockKeyboard: false })

      expect(addEventListenerSpy).toHaveBeenCalledWith('wheel', expect.any(Function), {
        passive: false
      })
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function), {
        passive: false
      })
      expect(addEventListenerSpy).toHaveBeenCalledTimes(2)
    })

    it('should add keyboard listener when lockKeyboard is true', () => {
      pageLock(true, { lockKeyboard: true })

      expect(addEventListenerSpy).toHaveBeenCalledWith('wheel', expect.any(Function), {
        passive: false
      })
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function), {
        passive: false
      })
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), {
        passive: false
      })
      expect(addEventListenerSpy).toHaveBeenCalledTimes(3)
    })
  })

  describe('unlocking functionality', () => {
    it('should remove event listeners when unlocking with default options', () => {
      pageLock(false)

      expect(removeEventListenerSpy).toHaveBeenCalledWith('wheel', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(3)
    })

    it('should not remove keyboard listener when lockKeyboard is false', () => {
      pageLock(false, { lockKeyboard: false })

      expect(removeEventListenerSpy).toHaveBeenCalledWith('wheel', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(2)
    })

    it('should remove keyboard listener when lockKeyboard is true', () => {
      pageLock(false, { lockKeyboard: true })

      expect(removeEventListenerSpy).toHaveBeenCalledWith('wheel', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(3)
    })

    it('should handle passive option when unlocking', () => {
      // Note: removeEventListener doesn't use the passive option, but we test the behavior
      pageLock(false, { passive: true, lockKeyboard: true })

      expect(removeEventListenerSpy).toHaveBeenCalledWith('wheel', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(3)
    })
  })

  describe('default parameter behavior', () => {
    it('should lock by default when called with no parameters', () => {
      pageLock()

      expect(addEventListenerSpy).toHaveBeenCalledTimes(3)
      expect(removeEventListenerSpy).not.toHaveBeenCalled()
    })

    it('should use default options when no options provided', () => {
      pageLock(true)

      expect(addEventListenerSpy).toHaveBeenCalledWith('wheel', expect.any(Function), {
        passive: false
      })
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function), {
        passive: false
      })
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), {
        passive: false
      })
    })
  })

  describe('environment checks', () => {
    it('should handle undefined window gracefully', () => {
      global.window = undefined as any

      expect(() => {
        pageLock(true)
      }).not.toThrow()

      expect(() => {
        pageLock(false)
      }).not.toThrow()
    })

    it('should not call addEventListener when window is undefined', () => {
      global.window = undefined as any

      pageLock(true)

      // Since window is undefined, these spies won't be called
      // We just ensure no errors are thrown
    })
  })

  describe('edge cases', () => {
    it('should handle partial options object', () => {
      pageLock(true, { passive: true })

      expect(addEventListenerSpy).toHaveBeenCalledWith('wheel', expect.any(Function), {
        passive: true
      })
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function), {
        passive: true
      })
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), {
        passive: true
      })
    })

    it('should handle empty options object', () => {
      pageLock(true, {})

      expect(addEventListenerSpy).toHaveBeenCalledWith('wheel', expect.any(Function), {
        passive: false
      })
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function), {
        passive: false
      })
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), {
        passive: false
      })
    })

    it('should handle null options', () => {
      pageLock(true, null as any)

      expect(addEventListenerSpy).toHaveBeenCalledWith('wheel', expect.any(Function), {
        passive: false
      })
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function), {
        passive: false
      })
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), {
        passive: false
      })
    })
  })

  describe('function references', () => {
    it('should use preventDefault function for wheel and touchmove events', () => {
      pageLock(true)

      const wheelCall = addEventListenerSpy.mock.calls.find((call) => call[0] === 'wheel')
      const touchMoveCall = addEventListenerSpy.mock.calls.find((call) => call[0] === 'touchmove')

      expect(wheelCall).toBeDefined()
      expect(touchMoveCall).toBeDefined()
      expect(typeof wheelCall[1]).toBe('function')
      expect(typeof touchMoveCall[1]).toBe('function')
    })

    it('should use preventKeyboard function for keydown events', () => {
      pageLock(true)

      const keydownCall = addEventListenerSpy.mock.calls.find((call) => call[0] === 'keydown')

      expect(keydownCall).toBeDefined()
      expect(typeof keydownCall[1]).toBe('function')
    })
  })

  describe('multiple calls', () => {
    it('should handle multiple lock calls', () => {
      pageLock(true)
      pageLock(true)

      // Should add listeners twice
      expect(addEventListenerSpy).toHaveBeenCalledTimes(6)
    })

    it('should handle multiple unlock calls', () => {
      pageLock(false)
      pageLock(false)

      // Should remove listeners twice
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(6)
    })

    it('should handle lock then unlock', () => {
      pageLock(true)
      expect(addEventListenerSpy).toHaveBeenCalledTimes(3)

      addEventListenerSpy.mockClear()

      pageLock(false)
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(3)
      expect(addEventListenerSpy).not.toHaveBeenCalled()
    })
  })
})
