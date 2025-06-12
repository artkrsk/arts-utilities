import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  processComplexValue,
  convertSettings,
  getLiveSettings,
  elementorEditorLoaded
} from '../../../src/ts/core/elementor/EditorUtils'

// Extend Window interface for Elementor
declare global {
  interface Window {
    elementorFrontend?: {
      isEditMode?: () => boolean
    }
  }
}

describe('EditorUtils', () => {
  beforeEach(() => {
    // Clear any global window modifications
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('processComplexValue', () => {
    it('should handle simple string mapping', () => {
      const settings = { test_key: 'test_value' }
      const result = processComplexValue('test_key', settings)
      expect(result).toBe('test_value')
    })

    it('should handle simple object mapping', () => {
      const settings = {
        key1: 'value1',
        key2: 'value2'
      }
      const valueMapping = {
        prop1: 'key1',
        prop2: 'key2'
      }
      const result = processComplexValue(valueMapping, settings)
      expect(result).toEqual({
        prop1: 'value1',
        prop2: 'value2'
      })
    })

    it('should handle object with value property', () => {
      const settings = {
        test_size: { size: 10, unit: 'px' }
      }
      const valueMapping = {
        fontSize: { value: 'test_size' }
      }
      const result = processComplexValue(valueMapping, settings)
      expect(result).toEqual({
        fontSize: 10
      })
    })

    it('should handle object with value property and return_size false', () => {
      const settings = {
        test_scale: { size: 1.5 }
      }
      const valueMapping = {
        scale: { value: 'test_scale', return_size: false }
      }
      const result = processComplexValue(valueMapping, settings)
      expect(result).toEqual({
        scale: { size: 1.5 }
      })
    })

    it('should handle object with value property and return_size false with unit', () => {
      const settings = {
        test_margin: { size: 20, unit: 'px' }
      }
      const valueMapping = {
        margin: { value: 'test_margin', return_size: false }
      }
      const result = processComplexValue(valueMapping, settings)
      expect(result).toEqual({
        margin: '20px'
      })
    })

    it('should handle simple value when return_size is false', () => {
      const settings = {
        test_value: 'simple_string'
      }
      const valueMapping = {
        text: { value: 'test_value', return_size: false }
      }
      const result = processComplexValue(valueMapping, settings)
      expect(result).toEqual({
        text: 'simple_string'
      })
    })

    it('should handle nested object mappings', () => {
      const settings = {
        nested_value: 'deep_value'
      }
      const valueMapping = {
        level1: {
          level2: 'nested_value'
        }
      }
      const result = processComplexValue(valueMapping, settings)
      expect(result).toEqual({
        level1: {
          level2: 'deep_value'
        }
      })
    })

    it('should fallback to whole value for simple types and objects without size', () => {
      const settings = {
        simple_value: 42,
        object_value: { custom: 'data', other: 'info' }
      }
      const valueMapping = {
        number: { value: 'simple_value' },
        object: { value: 'object_value' }
      }
      const result = processComplexValue(valueMapping, settings)
      expect(result).toEqual({
        number: 42,
        object: { custom: 'data', other: 'info' }
      })
    })
  })

  describe('convertSettings', () => {
    it('should handle simple string mappings', () => {
      const settings = {
        elementor_key: 'elementor_value',
        another_key: 'another_value'
      }
      const settingsMap = {
        jsKey: 'elementor_key',
        anotherJsKey: 'another_key'
      }
      const result = convertSettings(settings, settingsMap)
      expect(result).toEqual({
        jsKey: 'elementor_value',
        anotherJsKey: 'another_value'
      })
    })

    it('should skip undefined values', () => {
      const settings = {
        existing_key: 'value'
      }
      const settingsMap = {
        jsKey: 'existing_key',
        missingKey: 'non_existing_key'
      }
      const result = convertSettings(settings, settingsMap)
      expect(result).toEqual({
        jsKey: 'value'
      })
    })

    it('should handle conditional mappings that pass', () => {
      const settings = {
        enable_feature: true,
        feature_value: 'enabled_value'
      }
      const settingsMap = {
        feature: {
          condition: 'enable_feature',
          value: 'feature_value'
        }
      }
      const result = convertSettings(settings, settingsMap)
      expect(result).toEqual({
        feature: 'enabled_value'
      })
    })

    it('should handle conditional mappings that fail', () => {
      const settings = {
        enable_feature: false,
        feature_value: 'disabled_value'
      }
      const settingsMap = {
        feature: {
          condition: 'enable_feature',
          value: 'feature_value'
        }
      }
      const result = convertSettings(settings, settingsMap)
      expect(result).toEqual({
        feature: false
      })
    })

    it('should handle value property with string', () => {
      const settings = {
        source_key: 'source_value'
      }
      const settingsMap = {
        target: {
          value: 'source_key'
        }
      }
      const result = convertSettings(settings, settingsMap)
      expect(result).toEqual({
        target: 'source_value'
      })
    })

    it('should handle value property with return_size true', () => {
      const settings = {
        size_setting: { size: 16, unit: 'px' }
      }
      const settingsMap = {
        fontSize: {
          value: 'size_setting',
          return_size: true
        }
      }
      const result = convertSettings(settings, settingsMap)
      expect(result).toEqual({
        fontSize: 16
      })
    })

    it('should handle value property with object (TValueMapping)', () => {
      const settings = {
        width: 100,
        height: 200
      }
      const settingsMap = {
        dimensions: {
          value: {
            w: 'width',
            h: 'height'
          }
        }
      }
      const result = convertSettings(settings, settingsMap)
      expect(result).toEqual({
        dimensions: {
          w: 100,
          h: 200
        }
      })
    })

    it('should handle nested settings maps', () => {
      const settings = {
        nested_value1: 'value1',
        nested_value2: 'value2'
      }
      const settingsMap = {
        nestedOptions: {
          option1: 'nested_value1',
          option2: 'nested_value2'
        }
      }
      const result = convertSettings(settings, settingsMap)
      expect(result).toEqual({
        nestedOptions: {
          option1: 'value1',
          option2: 'value2'
        }
      })
    })

    it('should handle complex nested scenarios', () => {
      const settings = {
        enable_smooth: true,
        smooth_factor: { size: 0.8 },
        duration: 1000,
        easing: 'ease-out'
      }
      const settingsMap = {
        smoothScroll: {
          condition: 'enable_smooth',
          value: {
            factor: { value: 'smooth_factor', return_size: false },
            duration: 'duration',
            easing: 'easing'
          }
        }
      }
      const result = convertSettings(settings, settingsMap)
      expect(result).toEqual({
        smoothScroll: {
          factor: { size: 0.8 },
          duration: 1000,
          easing: 'ease-out'
        }
      })
    })

    it('should ignore non-object/non-string mappings', () => {
      const settings = { key: 'value' }
      const settingsMap = {
        validKey: 'key',
        invalidKey: null as any,
        anotherInvalidKey: 123 as any
      }
      const result = convertSettings(settings, settingsMap)
      expect(result).toEqual({
        validKey: 'value'
      })
    })
  })

  describe('getLiveSettings', () => {
    it('should extract keys from simple string mappings', () => {
      const settingsMap = {
        prop1: 'elementor_key1',
        prop2: 'elementor_key2'
      }
      const result = getLiveSettings(settingsMap)
      expect(result).toEqual(['elementor_key1', 'elementor_key2'])
    })

    it('should extract keys from object mappings with conditions', () => {
      const settingsMap = {
        feature: {
          condition: 'enable_feature',
          value: 'feature_value'
        }
      }
      const result = getLiveSettings(settingsMap)
      expect(result).toContain('enable_feature')
      expect(result).toContain('feature_value')
    })

    it('should extract keys from nested value mappings', () => {
      const settingsMap = {
        complex: {
          value: {
            prop1: 'nested_key1',
            prop2: 'nested_key2'
          }
        }
      }
      const result = getLiveSettings(settingsMap)
      expect(result).toContain('nested_key1')
      expect(result).toContain('nested_key2')
    })

    it('should handle additional settings', () => {
      const settingsMap = {
        prop1: 'key1'
      }
      const additionalSettings = ['additional_key1', 'additional_key2']
      const result = getLiveSettings(settingsMap, additionalSettings)
      expect(result).toContain('key1')
      expect(result).toContain('additional_key1')
      expect(result).toContain('additional_key2')
    })

    it('should remove duplicates', () => {
      const settingsMap = {
        prop1: 'duplicate_key',
        prop2: 'duplicate_key'
      }
      const additionalSettings = ['duplicate_key', 'unique_key']
      const result = getLiveSettings(settingsMap, additionalSettings)
      expect(result.filter((key) => key === 'duplicate_key')).toHaveLength(1)
      expect(result).toContain('unique_key')
    })

    it('should handle empty settings map', () => {
      const result = getLiveSettings()
      expect(result).toEqual([])
    })

    it('should handle empty settings map with additional settings', () => {
      const additionalSettings = ['key1', 'key2']
      const result = getLiveSettings({}, additionalSettings)
      expect(result).toEqual(['key1', 'key2'])
    })
  })

  describe('elementorEditorLoaded', () => {
    beforeEach(() => {
      // Reset global state
      global.window = undefined as any
    })

    it('should return true when elementorFrontend exists and is in edit mode', async () => {
      global.window = {
        elementorFrontend: {
          isEditMode: () => true
        }
      } as any

      const result = await elementorEditorLoaded()
      expect(result).toBe(true)
    })

    it('should return false when elementorFrontend exists but not in edit mode', async () => {
      global.window = {
        elementorFrontend: {
          isEditMode: () => false
        }
      } as any

      const result = await elementorEditorLoaded()
      expect(result).toBe(false)
    })

    it('should return false when window is undefined', async () => {
      global.window = undefined as any

      const result = await elementorEditorLoaded()
      expect(result).toBe(false)
    })

    it('should wait for elementor/frontend/init event when elementorFrontend not available', async () => {
      global.window = {
        addEventListener: vi.fn()
      } as any

      // Start the promise
      const promise = elementorEditorLoaded()

      // Verify event listener was added
      expect(global.window.addEventListener).toHaveBeenCalledWith(
        'elementor/frontend/init',
        expect.any(Function)
      )

      // Simulate the event firing
      const eventCallback = (global.window.addEventListener as any).mock.calls[0][1]
      global.window.elementorFrontend = {
        isEditMode: () => true
      }
      eventCallback()

      const result = await promise
      expect(result).toBe(true)
    })

    it('should resolve false when elementor init event fires but no elementorFrontend', async () => {
      global.window = {
        addEventListener: vi.fn()
      } as any

      // Start the promise
      const promise = elementorEditorLoaded()

      // Simulate the event firing without elementorFrontend
      const eventCallback = (global.window.addEventListener as any).mock.calls[0][1]
      eventCallback()

      const result = await promise
      expect(result).toBe(false)
    })

    it('should reuse existing promise when called multiple times', async () => {
      global.window = {
        addEventListener: vi.fn()
      } as any

      // Start multiple promises
      const promise1 = elementorEditorLoaded()
      const promise2 = elementorEditorLoaded()

      // Should only add event listener once
      expect(global.window.addEventListener).toHaveBeenCalledTimes(1)

      // Simulate the event firing
      const eventCallback = (global.window.addEventListener as any).mock.calls[0][1]
      global.window.elementorFrontend = {
        isEditMode: () => true
      }
      eventCallback()

      const [result1, result2] = await Promise.all([promise1, promise2])
      expect(result1).toBe(true)
      expect(result2).toBe(true)
    })

    it('should allow new promises after initialization completes', async () => {
      // Setup initial window without elementorFrontend
      global.window = {
        addEventListener: vi.fn()
      } as any

      // First promise that will wait for event
      const promise1 = elementorEditorLoaded()

      // Verify event listener was added
      expect(global.window.addEventListener).toHaveBeenCalledTimes(1)

      // Simulate event firing to complete first promise
      const eventCallback = (global.window.addEventListener as any).mock.calls[0][1]
      global.window.elementorFrontend = {
        isEditMode: () => true
      }
      eventCallback()

      // Wait for first promise to complete
      const result1 = await promise1
      expect(result1).toBe(true)

      // Second promise should work immediately since elementorFrontend is now available
      const promise2 = elementorEditorLoaded()
      const result2 = await promise2
      expect(result2).toBe(true)

      // No new event listener should be added for second call
      expect(global.window.addEventListener).toHaveBeenCalledTimes(1)
    })
  })
})
