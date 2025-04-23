import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce } from '../../../src/ts/core/events/Debounce'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should delay function execution until after wait time has elapsed', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 100)

    debouncedFn()
    expect(mockFn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(50)
    expect(mockFn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(50)
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should reset the timer on subsequent calls', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 100)

    debouncedFn()
    vi.advanceTimersByTime(50) // 50ms elapsed

    debouncedFn() // Reset timer
    vi.advanceTimersByTime(50) // 50ms elapsed again, 100ms total, but timer was reset at 50ms
    expect(mockFn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(50) // Another 50ms, so 100ms since the reset
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should preserve the context and arguments', () => {
    const mockFn = vi.fn()
    const context = { value: 'test' }
    const debouncedFn = debounce(function (this: any, arg1: string, arg2: number) {
      mockFn(this.value, arg1, arg2)
    }, 100)

    debouncedFn.call(context, 'hello', 42)
    vi.advanceTimersByTime(100)

    expect(mockFn).toHaveBeenCalledWith('test', 'hello', 42)
  })
})
