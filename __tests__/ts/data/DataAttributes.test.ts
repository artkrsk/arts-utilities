import { describe, it, expect, beforeEach } from 'vitest'
import {
  parseAttribute,
  filterDataAttributes,
  parseDataAttributes
} from '../../../src/ts/core/data/DataAttributes'
import type { IDataAttribute } from '../../../src/ts/core/interfaces'

describe('DataAttributes', () => {
  let mockElement: HTMLElement

  beforeEach(() => {
    // Create a mock HTML element with various data attributes
    mockElement = document.createElement('div')
  })

  describe('parseAttribute function', () => {
    it('should parse simple data attribute', () => {
      const attr: IDataAttribute = { name: 'data-test', value: 'value' }
      const result = {}

      parseAttribute(attr, result, '-')

      expect(result).toEqual({ test: 'value' })
    })

    it('should parse nested data attribute with default separator', () => {
      const attr: IDataAttribute = { name: 'data-config-timeout', value: '5000' }
      const result = {}

      parseAttribute(attr, result, '-')

      expect(result).toEqual({ config: { timeout: '5000' } })
    })

    it('should parse deeply nested data attribute', () => {
      const attr: IDataAttribute = { name: 'data-widget-settings-animation-duration', value: '300' }
      const result = {}

      parseAttribute(attr, result, '-')

      expect(result).toEqual({
        widget: {
          settings: {
            animation: {
              duration: '300'
            }
          }
        }
      })
    })

    it('should parse with custom separator', () => {
      const attr: IDataAttribute = { name: 'data-api__config__timeout', value: '1000' }
      const result = {}

      parseAttribute(attr, result, '__')

      expect(result).toEqual({ api: { config: { timeout: '1000' } } })
    })

    it('should handle single level attribute without separators', () => {
      const attr: IDataAttribute = { name: 'data-simple', value: 'test' }
      const result = {}

      parseAttribute(attr, result, '-')

      expect(result).toEqual({ simple: 'test' })
    })

    it('should merge with existing object structure', () => {
      const result = { config: { existing: 'value' } }
      const attr: IDataAttribute = { name: 'data-config-new', value: 'test' }

      parseAttribute(attr, result, '-')

      expect(result).toEqual({
        config: {
          existing: 'value',
          new: 'test'
        }
      })
    })

    it('should overwrite existing primitive values', () => {
      const result = { config: { timeout: 'old' } }
      const attr: IDataAttribute = { name: 'data-config-timeout', value: 'new' }

      parseAttribute(attr, result, '-')

      expect(result).toEqual({
        config: {
          timeout: 'new'
        }
      })
    })

    it('should handle empty path parts', () => {
      const attr: IDataAttribute = { name: 'data-test--value', value: 'content' }
      const result = {}

      parseAttribute(attr, result, '-')

      expect(result).toEqual({
        test: {
          '': {
            value: 'content'
          }
        }
      })
    })

    it('should skip data part if it appears in path', () => {
      const attr: IDataAttribute = { name: 'data-data-test', value: 'value' }
      const result = {}

      parseAttribute(attr, result, '-')

      expect(result).toEqual({ test: 'value' })
    })

    it('should handle non-object existing values by replacing them', () => {
      const result = { config: 'primitive' }
      const attr: IDataAttribute = { name: 'data-config-nested', value: 'test' }

      parseAttribute(attr, result, '-')

      expect(result).toEqual({
        config: {
          nested: 'test'
        }
      })
    })
  })

  describe('filterDataAttributes function', () => {
    it('should return true for data attributes with matching pattern', () => {
      const attr: IDataAttribute = { name: 'data-parallax-speed', value: '2' }
      const pattern = /parallax/

      const result = filterDataAttributes(attr, pattern)

      expect(result).toBe(true)
    })

    it('should return false for data attributes with non-matching pattern', () => {
      const attr: IDataAttribute = { name: 'data-other-value', value: 'test' }
      const pattern = /parallax/

      const result = filterDataAttributes(attr, pattern)

      expect(result).toBe(false)
    })

    it('should return false for non-data attributes', () => {
      const attr: IDataAttribute = { name: 'class', value: 'example' }
      const pattern = /.*/

      const result = filterDataAttributes(attr, pattern)

      expect(result).toBe(false)
    })

    it('should return true for all data attributes when no pattern provided', () => {
      const attr: IDataAttribute = { name: 'data-test', value: 'value' }
      const pattern = null as any

      const result = filterDataAttributes(attr, pattern)

      expect(result).toBe(true)
    })

    it('should return true for data attributes matching complex pattern', () => {
      const attr: IDataAttribute = { name: 'data-widget-animation', value: 'fade' }
      const pattern = /(widget|animation|parallax)/

      const result = filterDataAttributes(attr, pattern)

      expect(result).toBe(true)
    })

    it('should test pattern against attribute name without data- prefix', () => {
      const attr: IDataAttribute = { name: 'data-config-timeout', value: '5000' }
      const pattern = /^config/

      const result = filterDataAttributes(attr, pattern)

      expect(result).toBe(true)
    })

    it('should handle attributes that start with data- but have additional content', () => {
      const attr: IDataAttribute = { name: 'data-test-value', value: 'content' }
      const pattern = /test/

      const result = filterDataAttributes(attr, pattern)

      expect(result).toBe(true)
    })
  })

  describe('parseDataAttributes function', () => {
    it('should parse all data attributes with default options', () => {
      mockElement.setAttribute('data-speed', '2')
      mockElement.setAttribute('data-effect-type', 'parallax')
      mockElement.setAttribute('data-effect-intensity', '0.5')
      mockElement.setAttribute('class', 'test') // Non-data attribute

      const result = parseDataAttributes(mockElement)

      expect(result).toEqual({
        speed: '2',
        effect: {
          type: 'parallax',
          intensity: '0.5'
        }
      })
    })

    it('should parse with custom separator', () => {
      mockElement.setAttribute('data-api__config__timeout', '5000')
      mockElement.setAttribute('data-api__config__retries', '3')
      mockElement.setAttribute('data-api__url', 'https://example.com')

      const result = parseDataAttributes(mockElement, { separator: '__' })

      expect(result).toEqual({
        api: {
          config: {
            timeout: '5000',
            retries: '3'
          },
          url: 'https://example.com'
        }
      })
    })

    it('should filter attributes by pattern', () => {
      mockElement.setAttribute('data-parallax-speed', '2')
      mockElement.setAttribute('data-parallax-direction', 'up')
      mockElement.setAttribute('data-other-value', 'test')
      mockElement.setAttribute('data-animation-duration', '300')

      const result = parseDataAttributes(mockElement, { pattern: /parallax/ })

      expect(result).toEqual({
        parallax: {
          speed: '2',
          direction: 'up'
        }
      })
    })

    it('should handle complex nested structure', () => {
      mockElement.setAttribute('data-widget-settings-animation-duration', '300')
      mockElement.setAttribute('data-widget-settings-animation-easing', 'ease-out')
      mockElement.setAttribute('data-widget-settings-theme', 'dark')
      mockElement.setAttribute('data-widget-enabled', 'true')

      const result = parseDataAttributes(mockElement)

      expect(result).toEqual({
        widget: {
          settings: {
            animation: {
              duration: '300',
              easing: 'ease-out'
            },
            theme: 'dark'
          },
          enabled: 'true'
        }
      })
    })

    it('should return empty object when no data attributes present', () => {
      mockElement.setAttribute('class', 'test')
      mockElement.setAttribute('id', 'example')

      const result = parseDataAttributes(mockElement)

      expect(result).toEqual({})
    })

    it('should handle element with no attributes', () => {
      const result = parseDataAttributes(mockElement)

      expect(result).toEqual({})
    })

    it('should use default options when options object is empty', () => {
      mockElement.setAttribute('data-test-value', 'content')

      const result = parseDataAttributes(mockElement, {})

      expect(result).toEqual({
        test: {
          value: 'content'
        }
      })
    })

    it('should handle options with only separator specified', () => {
      mockElement.setAttribute('data-api::config::timeout', '1000')
      mockElement.setAttribute('data-other::value', 'test')

      const result = parseDataAttributes(mockElement, { separator: '::' })

      expect(result).toEqual({
        api: {
          config: {
            timeout: '1000'
          }
        },
        other: {
          value: 'test'
        }
      })
    })

    it('should handle options with only pattern specified', () => {
      mockElement.setAttribute('data-config-timeout', '5000')
      mockElement.setAttribute('data-config-retries', '3')
      mockElement.setAttribute('data-other-value', 'test')

      const result = parseDataAttributes(mockElement, { pattern: /config/ })

      expect(result).toEqual({
        config: {
          timeout: '5000',
          retries: '3'
        }
      })
    })

    it('should handle both custom separator and pattern', () => {
      mockElement.setAttribute('data-widget__animation__duration', '300')
      mockElement.setAttribute('data-widget__theme', 'dark')
      mockElement.setAttribute('data-other__value', 'test')

      const result = parseDataAttributes(mockElement, {
        separator: '__',
        pattern: /widget/
      })

      expect(result).toEqual({
        widget: {
          animation: {
            duration: '300'
          },
          theme: 'dark'
        }
      })
    })

    it('should handle pattern that matches nothing', () => {
      mockElement.setAttribute('data-test', 'value')
      mockElement.setAttribute('data-example', 'content')

      const result = parseDataAttributes(mockElement, { pattern: /nonexistent/ })

      expect(result).toEqual({})
    })

    it('should handle mixed data and non-data attributes', () => {
      mockElement.setAttribute('data-valid', 'yes')
      mockElement.setAttribute('class', 'test')
      mockElement.setAttribute('data-nested-value', 'content')
      mockElement.setAttribute('id', 'example')

      const result = parseDataAttributes(mockElement)

      expect(result).toEqual({
        valid: 'yes',
        nested: {
          value: 'content'
        }
      })
    })

    it('should preserve attribute values as strings', () => {
      mockElement.setAttribute('data-number', '123')
      mockElement.setAttribute('data-boolean', 'true')
      mockElement.setAttribute('data-null', 'null')
      mockElement.setAttribute('data-empty', '')

      const result = parseDataAttributes(mockElement)

      expect(result).toEqual({
        number: '123',
        boolean: 'true',
        null: 'null',
        empty: ''
      })
    })
  })
})
