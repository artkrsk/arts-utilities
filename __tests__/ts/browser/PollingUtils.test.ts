import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { waitForVariable } from '../../../src/ts/core/browser/PollingUtils'

// Mock window object
const mockWindow = {} as any

describe('PollingUtils', () => {
  beforeEach(() => {
    // Clear window object before each test
    Object.keys(mockWindow).forEach((key) => {
      delete mockWindow[key]
    })

    // Mock global window
    global.window = mockWindow

    // Reset timers
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('waitForVariable', () => {
    it('should resolve immediately if variable is already available', async () => {
      const testValue = { version: '1.0.0', init: () => {} }
      mockWindow.MyLibrary = testValue

      const result = await waitForVariable('MyLibrary')
      expect(result).toBe(testValue)
    })

    it('should wait and resolve when variable becomes available', async () => {
      const testValue = 'test-value'

      // Start waiting for variable
      const promise = waitForVariable('DelayedVariable')

      // Advance timers to trigger first check
      vi.advanceTimersByTime(20)

      // Set the variable
      mockWindow.DelayedVariable = testValue

      // Advance timers to trigger the check that finds the variable
      vi.advanceTimersByTime(20)
    })

    it('should use default polling interval (20ms)', async () => {
      const testValue = 'test-value'
      const setIntervalSpy = vi.spyOn(global, 'setInterval')

      const promise = waitForVariable('TestVariable')

      // Set variable after first check
      vi.advanceTimersByTime(20)
      mockWindow.TestVariable = testValue
      vi.advanceTimersByTime(20)

      await promise

      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 20)
    })

    it('should use custom polling interval', async () => {
      const testValue = 'test-value'
      const setIntervalSpy = vi.spyOn(global, 'setInterval')

      const promise = waitForVariable('TestVariable', { checkingInterval: 50 })

      // Set variable after first check
      vi.advanceTimersByTime(50)
      mockWindow.TestVariable = testValue
      vi.advanceTimersByTime(50)

      await promise

      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 50)
    })

    it('should reject after default timeout (10000ms)', async () => {
      const promise = waitForVariable('NonExistentVariable')

      // Fast-forward past the default timeout
      vi.advanceTimersByTime(10000)

      await expect(promise).rejects.toThrow(
        'Global variable "window.NonExistentVariable" is still not defined after 10000ms.'
      )
    })

    it('should reject after custom timeout', async () => {
      const promise = waitForVariable('NonExistentVariable', { timeout: 5000 })

      // Fast-forward past the custom timeout
      vi.advanceTimersByTime(5000)

      await expect(promise).rejects.toThrow(
        'Global variable "window.NonExistentVariable" is still not defined after 5000ms.'
      )
    })

    it('should clear interval when variable is found', async () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

      const promise = waitForVariable('TestVariable')

      vi.advanceTimersByTime(20)
      mockWindow.TestVariable = 'test-value'
      vi.advanceTimersByTime(20)

      await promise

      expect(clearIntervalSpy).toHaveBeenCalled()
    })

    it('should clear interval on timeout', async () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

      const promise = waitForVariable('NonExistentVariable', { timeout: 1000 })

      vi.advanceTimersByTime(1000)

      try {
        await promise
      } catch (error) {
        // Expected to throw
      }

      expect(clearIntervalSpy).toHaveBeenCalled()
    })

    it('should handle undefined, null, and falsy values correctly', async () => {
      // Should not resolve for undefined (default behavior)
      const undefinedPromise = waitForVariable('UndefinedVar', { timeout: 100 })
      vi.advanceTimersByTime(100)
      await expect(undefinedPromise).rejects.toThrow()

      // Should resolve for null
      mockWindow.NullVar = null
      const nullResult = await waitForVariable('NullVar')
      expect(nullResult).toBeNull()

      // Should resolve for false
      mockWindow.FalseVar = false
      const falseResult = await waitForVariable('FalseVar')
      expect(falseResult).toBe(false)

      // Should resolve for 0
      mockWindow.ZeroVar = 0
      const zeroResult = await waitForVariable('ZeroVar')
      expect(zeroResult).toBe(0)

      // Should resolve for empty string
      mockWindow.EmptyStringVar = ''
      const emptyStringResult = await waitForVariable('EmptyStringVar')
      expect(emptyStringResult).toBe('')
    })

    it('should handle variable name edge cases', async () => {
      // Variable with special characters (if valid JS identifier)
      mockWindow.$special_var123 = 'special-value'
      const specialResult = await waitForVariable('$special_var123')
      expect(specialResult).toBe('special-value')
    })

    it('should work with complex objects', async () => {
      const complexObject = {
        version: '2.0.0',
        api: {
          init: vi.fn(),
          destroy: vi.fn()
        },
        config: {
          theme: 'dark',
          features: ['feature1', 'feature2']
        }
      }

      const promise = waitForVariable('ComplexLibrary')

      vi.advanceTimersByTime(20)
      mockWindow.ComplexLibrary = complexObject
      vi.advanceTimersByTime(20)

      const result = await promise

      expect(result).toBe(complexObject)
      expect(result.version).toBe('2.0.0')
      expect(result.api.init).toBeInstanceOf(Function)
      expect(result.config.features).toEqual(['feature1', 'feature2'])
    })

    it('should work with both options parameters', async () => {
      const testValue = 'combined-options-test'
      const setIntervalSpy = vi.spyOn(global, 'setInterval')

      const promise = waitForVariable('CombinedOptionsVar', {
        checkingInterval: 100,
        timeout: 2000
      })

      vi.advanceTimersByTime(100)
      mockWindow.CombinedOptionsVar = testValue
      vi.advanceTimersByTime(100)

      const result = await promise

      expect(result).toBe(testValue)
      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 100)
    })

    it('should throw Error objects with correct message format', async () => {
      const promise = waitForVariable('ErrorTestVar', { timeout: 500 })

      vi.advanceTimersByTime(500)

      try {
        await promise
        expect.fail('Promise should have rejected')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe(
          'Global variable "window.ErrorTestVar" is still not defined after 500ms.'
        )
      }
    })
  })
})
