import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  parseColorString,
  sanitizeSelector,
  normalizeURL,
  parseClassNames
} from '../../../src/ts/core/strings/StringsUtils'

describe('StringsUtils', () => {
  describe('parseColorString', () => {
    it('should parse RGB color string correctly', () => {
      const result = parseColorString('rgb(255, 128, 0)')

      expect(result).toEqual({
        color: 'rgb(255, 128, 0)',
        alpha: 1.0
      })
    })

    it('should parse RGBA color string with alpha', () => {
      const result = parseColorString('rgba(255, 128, 0, 0.5)')

      expect(result).toEqual({
        color: 'rgb(255, 128, 0)',
        alpha: 0.5
      })
    })

    it('should parse RGBA color string with varying whitespace', () => {
      const result = parseColorString('rgba( 255 , 128 , 0 , 0.75 )')

      expect(result).toEqual({
        color: 'rgb(255, 128, 0)',
        alpha: 0.75
      })
    })

    it('should parse RGB color string with extra spaces', () => {
      const result = parseColorString('rgb( 255 , 128 , 0 )')

      expect(result).toEqual({
        color: 'rgb(255, 128, 0)',
        alpha: 1.0
      })
    })

    it('should parse RGBA with decimal alpha values', () => {
      const result = parseColorString('rgba(100, 200, 50, 0.25)')

      expect(result).toEqual({
        color: 'rgb(100, 200, 50)',
        alpha: 0.25
      })
    })

    it('should parse RGBA with integer alpha (1)', () => {
      const result = parseColorString('rgba(100, 200, 50, 1)')

      expect(result).toEqual({
        color: 'rgb(100, 200, 50)',
        alpha: 1.0
      })
    })

    it('should parse RGBA with alpha 0', () => {
      const result = parseColorString('rgba(100, 200, 50, 0)')

      expect(result).toEqual({
        color: 'rgb(100, 200, 50)',
        alpha: 0.0
      })
    })

    // HEX color tests
    it('should parse 3-digit HEX color', () => {
      const result = parseColorString('#f80')

      expect(result).toEqual({
        color: 'rgb(255, 136, 0)',
        alpha: 1.0
      })
    })

    it('should parse 6-digit HEX color', () => {
      const result = parseColorString('#ff8800')

      expect(result).toEqual({
        color: 'rgb(255, 136, 0)',
        alpha: 1.0
      })
    })

    it('should parse 8-digit HEX color with alpha', () => {
      const result = parseColorString('#ff880080')

      expect(result).toEqual({
        color: 'rgb(255, 136, 0)',
        alpha: 0.5019607843137255 // 128/255
      })
    })

    it('should parse HEX color with uppercase letters', () => {
      const result = parseColorString('#FF8800')

      expect(result).toEqual({
        color: 'rgb(255, 136, 0)',
        alpha: 1.0
      })
    })

    it('should parse HEX color with mixed case', () => {
      const result = parseColorString('#Ff8800')

      expect(result).toEqual({
        color: 'rgb(255, 136, 0)',
        alpha: 1.0
      })
    })

    it('should parse black and white HEX colors', () => {
      const blackResult = parseColorString('#000')
      expect(blackResult).toEqual({
        color: 'rgb(0, 0, 0)',
        alpha: 1.0
      })

      const whiteResult = parseColorString('#fff')
      expect(whiteResult).toEqual({
        color: 'rgb(255, 255, 255)',
        alpha: 1.0
      })

      const blackResult6 = parseColorString('#000000')
      expect(blackResult6).toEqual({
        color: 'rgb(0, 0, 0)',
        alpha: 1.0
      })

      const whiteResult6 = parseColorString('#ffffff')
      expect(whiteResult6).toEqual({
        color: 'rgb(255, 255, 255)',
        alpha: 1.0
      })
    })

    it('should parse HEX color with full transparency', () => {
      const result = parseColorString('#ff880000')

      expect(result).toEqual({
        color: 'rgb(255, 136, 0)',
        alpha: 0.0
      })
    })

    it('should parse HEX color with full opacity', () => {
      const result = parseColorString('#ff8800ff')

      expect(result).toEqual({
        color: 'rgb(255, 136, 0)',
        alpha: 1.0
      })
    })

    it('should return null for invalid color formats', () => {
      expect(parseColorString('hsl(120, 100%, 50%)')).toBeNull()
      expect(parseColorString('red')).toBeNull()
      expect(parseColorString('invalid')).toBeNull()
    })

    it('should return null for invalid HEX formats', () => {
      expect(parseColorString('#')).toBeNull()
      expect(parseColorString('#f')).toBeNull()
      expect(parseColorString('#ff')).toBeNull()
      expect(parseColorString('#ffff')).toBeNull() // 4-digit not supported
      expect(parseColorString('#fffff')).toBeNull() // 5-digit not supported
      expect(parseColorString('#fffffff')).toBeNull() // 7-digit not supported
      expect(parseColorString('#fffffffff')).toBeNull() // 9-digit not supported
      expect(parseColorString('#xyz')).toBeNull() // Invalid hex characters
      expect(parseColorString('ff8800')).toBeNull() // Missing # prefix
    })

    it('should return null for malformed rgb/rgba strings', () => {
      expect(parseColorString('rgb(255, 128)')).toBeNull()
      expect(parseColorString('rgba(255, 128, 0)')).toBeNull() // Missing alpha in rgba
      expect(parseColorString('rgb(255, 128, 0, 0.5)')).toBeNull() // Alpha in rgb
      expect(parseColorString('rgb(255, 128, abc)')).toBeNull()
    })

    it('should return null for empty or invalid input', () => {
      expect(parseColorString('')).toBeNull()
      expect(parseColorString('   ')).toBeNull()

      // @ts-ignore - Testing with invalid input
      expect(parseColorString(null)).toBeNull()

      // @ts-ignore - Testing with invalid input
      expect(parseColorString(undefined)).toBeNull()

      // @ts-ignore - Testing with invalid input
      expect(parseColorString(123)).toBeNull()
    })

    it('should handle edge cases with decimal alpha formats', () => {
      const result1 = parseColorString('rgba(255, 128, 0, .5)')
      expect(result1).toEqual({
        color: 'rgb(255, 128, 0)',
        alpha: 0.5
      })

      const result2 = parseColorString('rgba(255, 128, 0, 0.)')
      expect(result2).toEqual({
        color: 'rgb(255, 128, 0)',
        alpha: 0.0
      })
    })

    it('should handle RGBA with empty alpha value', () => {
      // Test case where alpha capture group matches but is empty string
      // This covers the `a ? parseFloat(a) : 0` ternary where a is falsy
      const result = parseColorString('rgba(255, 128, 0, )')
      expect(result).toEqual({
        color: 'rgb(255, 128, 0)',
        alpha: 0
      })
    })

    it('should handle boundary RGB values', () => {
      const result1 = parseColorString('rgb(0, 0, 0)')
      expect(result1).toEqual({
        color: 'rgb(0, 0, 0)',
        alpha: 1.0
      })

      const result2 = parseColorString('rgb(255, 255, 255)')
      expect(result2).toEqual({
        color: 'rgb(255, 255, 255)',
        alpha: 1.0
      })
    })

    it('should return null for invalid hex color lengths', () => {
      const result1 = parseColorString('#f') // 1 digit
      expect(result1).toBeNull()

      const result2 = parseColorString('#ff') // 2 digits
      expect(result2).toBeNull()

      const result3 = parseColorString('#ffff') // 4 digits
      expect(result3).toBeNull()

      const result4 = parseColorString('#fffff') // 5 digits
      expect(result4).toBeNull()

      const result5 = parseColorString('#fffffff') // 7 digits
      expect(result5).toBeNull()

      const result6 = parseColorString('#fffffffff') // 9 digits
      expect(result6).toBeNull()

      // Invalid hex lengths (not 3, 6, or 8 characters) - covers lines 245-246
      expect(parseColorString('#ab')).toBeNull() // 2 characters
      expect(parseColorString('#abcd')).toBeNull() // 4 characters
      expect(parseColorString('#abcde')).toBeNull() // 5 characters
      expect(parseColorString('#abcdefg')).toBeNull() // 7 characters
      expect(parseColorString('#abcdefghi')).toBeNull() // 9 characters
      expect(parseColorString('#abcdefghijk')).toBeNull() // 11 characters
    })

    it('should parse 6-character hex colors', () => {
      const result = parseColorString('#ff0000')
      expect(result).toEqual({
        color: 'rgb(255, 0, 0)',
        alpha: 1
      })
    })

    it('should return null for invalid color strings', () => {
      const result1 = parseColorString('invalid-color')
      expect(result1).toBeNull()

      const result2 = parseColorString('hsl(120, 50%, 50%)')
      expect(result2).toBeNull()

      const result3 = parseColorString('')
      expect(result3).toBeNull()

      const result4 = parseColorString('red')
      expect(result4).toBeNull()
    })
  })

  describe('sanitizeSelector', () => {
    let mockQuerySelector: any
    let mockConsoleWarn: any

    beforeEach(() => {
      mockQuerySelector = vi.fn()
      mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      // Mock document.querySelector
      global.document = {
        querySelector: mockQuerySelector
      } as any
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should return empty string for non-string input', () => {
      const result = sanitizeSelector(null as any)
      expect(result).toBe('')
    })

    it('should return empty string for empty string input', () => {
      const result = sanitizeSelector('')
      expect(result).toBe('')
    })

    it('should return empty string for whitespace-only input', () => {
      const result = sanitizeSelector('   ')
      expect(result).toBe('')
    })

    it('should warn for invalid input when verbose is true', () => {
      sanitizeSelector('', true)
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        'sanitizeSelector: selector must be a non-empty string'
      )
    })

    it('should not warn for invalid input when verbose is false', () => {
      sanitizeSelector('')
      expect(mockConsoleWarn).not.toHaveBeenCalled()
    })

    it('should normalize line breaks and tabs to spaces', () => {
      mockQuerySelector.mockReturnValue({}) // Valid selector
      const result = sanitizeSelector('.class1\n.class2\r\n.class3\t.class4')
      expect(result).toBe('.class1 .class2 .class3 .class4')
    })

    it('should normalize multiple spaces to single spaces', () => {
      mockQuerySelector.mockReturnValue({}) // Valid selector
      const result = sanitizeSelector('.class1    .class2     .class3')
      expect(result).toBe('.class1 .class2 .class3')
    })

    it('should remove leading and trailing whitespace and commas', () => {
      mockQuerySelector.mockReturnValue({}) // Valid selector
      const result = sanitizeSelector('  , .class1, .class2 , ')
      expect(result).toBe('.class1,.class2')
    })

    it('should normalize spaces around commas', () => {
      mockQuerySelector.mockReturnValue({}) // Valid selector
      const result = sanitizeSelector('.class1 , .class2  ,  .class3')
      expect(result).toBe('.class1,.class2,.class3')
    })

    it('should return normalized selector for valid selectors', () => {
      mockQuerySelector.mockReturnValue({}) // Valid selector
      const result = sanitizeSelector('.valid-class')
      expect(result).toBe('.valid-class')
      expect(mockQuerySelector).toHaveBeenCalledWith('.valid-class')
    })

    it('should return empty string for invalid selectors', () => {
      mockQuerySelector.mockImplementation(() => {
        throw new Error('Invalid selector')
      })
      const result = sanitizeSelector('invalid[selector')
      expect(result).toBe('')
    })

    it('should warn for invalid selectors when verbose is true', () => {
      const error = new Error('Invalid selector')
      mockQuerySelector.mockImplementation(() => {
        throw error
      })
      sanitizeSelector('invalid[selector', true)
      expect(mockConsoleWarn).toHaveBeenCalledWith('sanitizeSelector: Invalid selector', error)
    })

    it('should not warn for invalid selectors when verbose is false', () => {
      mockQuerySelector.mockImplementation(() => {
        throw new Error('Invalid selector')
      })
      sanitizeSelector('invalid[selector')
      expect(mockConsoleWarn).not.toHaveBeenCalled()
    })
  })

  describe('normalizeURL', () => {
    const originalLocation = global.window?.location

    beforeEach(() => {
      // Mock window.location
      global.window = {
        location: {
          origin: 'https://example.com'
        }
      } as any
    })

    afterEach(() => {
      if (originalLocation) {
        global.window = { location: originalLocation } as any
      }
    })

    it('should normalize absolute URLs', () => {
      const result = normalizeURL('https://other.com/path/to/page')
      expect(result).toBe('https://other.com/path/to/page')
    })

    it('should normalize relative URLs against current origin', () => {
      const result = normalizeURL('/path/to/page')
      expect(result).toBe('https://example.com/path/to/page')
    })

    it('should normalize relative URLs without leading slash', () => {
      const result = normalizeURL('path/to/page')
      expect(result).toBe('https://example.com/path/to/page')
    })

    it('should remove trailing slash for non-root URLs', () => {
      const result = normalizeURL('https://example.com/path/to/page/')
      expect(result).toBe('https://example.com/path/to/page')
    })

    it('should preserve trailing slash for root URLs', () => {
      const result = normalizeURL('https://example.com/')
      expect(result).toBe('https://example.com/')
    })

    it('should handle URLs with query parameters', () => {
      const result = normalizeURL('https://example.com/page?param=value/')
      expect(result).toBe('https://example.com/page?param=value')
    })

    it('should handle URLs with fragments', () => {
      const result = normalizeURL('https://example.com/page#section/')
      expect(result).toBe('https://example.com/page#section')
    })
  })

  describe('parseClassNames', () => {
    it('should parse space-separated class names', () => {
      const result = parseClassNames('class1 class2 class3')
      expect(result).toEqual(['class1', 'class2', 'class3'])
    })

    it('should handle class names with leading dots', () => {
      const result = parseClassNames('.class1 .class2 .class3')
      expect(result).toEqual(['class1', 'class2', 'class3'])
    })

    it('should handle mixed class names with and without dots', () => {
      const result = parseClassNames('class1 .class2 class3 .class4')
      expect(result).toEqual(['class1', 'class2', 'class3', 'class4'])
    })

    it('should handle extra whitespace', () => {
      const result = parseClassNames('  class1   class2    class3  ')
      expect(result).toEqual(['class1', 'class2', 'class3'])
    })

    it('should handle empty strings and return empty array', () => {
      const result1 = parseClassNames('')
      expect(result1).toEqual([])

      const result2 = parseClassNames('   ')
      expect(result2).toEqual([])
    })

    it('should handle non-string input', () => {
      const result = parseClassNames(undefined as any)
      expect(result).toEqual([])
    })

    it('should handle single class name', () => {
      const result = parseClassNames('single-class')
      expect(result).toEqual(['single-class'])
    })

    it('should handle class name with leading dot', () => {
      const result = parseClassNames('.single-class')
      expect(result).toEqual(['single-class'])
    })

    it('should filter out empty class names from multiple spaces', () => {
      const result = parseClassNames('class1     class2')
      expect(result).toEqual(['class1', 'class2'])
    })
  })

  describe('parseColorString - edge cases', () => {
    it('should return null for invalid 8-digit hex format', () => {
      // Test the specific uncovered lines 245-246 in parseColorString
      const result = parseColorString('#12345G7H') // Invalid hex characters
      expect(result).toBeNull()
    })

    it('should handle malformed 8-digit hex colors', () => {
      // Test edge case that would hit the else branch on lines 245-246
      const result = parseColorString('#1234567') // 7 digits instead of 8
      expect(result).toBeNull()
    })
  })
})
