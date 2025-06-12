import { describe, it, expect } from 'vitest'
import { parseColorString } from '../../../src/ts/core/strings/StringsUtils'

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
  })
})
