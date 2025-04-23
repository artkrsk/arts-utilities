import { describe, it, expect } from 'vitest'
import { deepmerge, deepmergeAll } from '../../../src/ts/core/data/DeepMerge'

describe('DeepMerge', () => {
  describe('deepmerge function', () => {
    it('should merge shallow objects', () => {
      const target = { a: 1, b: 2 }
      const source = { b: 3, c: 4 }
      const result = deepmerge(target, source)

      expect(result).toEqual({ a: 1, b: 3, c: 4 })
      // Original objects should remain unchanged
      expect(target).toEqual({ a: 1, b: 2 })
      expect(source).toEqual({ b: 3, c: 4 })
    })

    it('should deeply merge nested objects', () => {
      const target = {
        a: 1,
        nested: {
          x: 10,
          y: 20
        }
      }
      const source = {
        b: 2,
        nested: {
          y: 30,
          z: 40
        }
      }

      const result = deepmerge(target, source)

      expect(result).toEqual({
        a: 1,
        b: 2,
        nested: {
          x: 10,
          y: 30,
          z: 40
        }
      })
    })

    it('should concatenate arrays', () => {
      const target = { items: [1, 2, 3] }
      const source = { items: [4, 5] }

      const result = deepmerge(target, source)

      expect(result).toEqual({
        items: [1, 2, 3, 4, 5]
      })
    })

    it('should handle null and undefined values', () => {
      const target = { a: 1, b: null, c: undefined }
      const source = { b: 2, c: 3, d: null }

      const result = deepmerge(target, source)

      expect(result).toEqual({
        a: 1,
        b: 2,
        c: 3,
        d: null
      })
    })

    it('should handle non-object source values', () => {
      const target = { a: 1 }

      // @ts-ignore - Testing with invalid input
      const result1 = deepmerge(target, null)
      expect(result1).toEqual({ a: 1 })

      // @ts-ignore - Testing with invalid input
      const result2 = deepmerge(target, undefined)
      expect(result2).toEqual({ a: 1 })

      // @ts-ignore - Testing with invalid input
      const result3 = deepmerge(target, 'string')
      expect(result3).toEqual({ a: 1 })

      // @ts-ignore - Testing with invalid input
      const result4 = deepmerge(target, [1, 2, 3])
      expect(result4).toEqual({ a: 1 })
    })

    it('should handle complex nested structures', () => {
      const target = {
        config: {
          options: {
            debug: true,
            level: 1
          },
          items: [1, 2]
        }
      }

      const source = {
        config: {
          options: {
            level: 2,
            timeout: 1000
          },
          items: [3, 4]
        },
        enabled: true
      }

      const result = deepmerge(target, source)

      expect(result).toEqual({
        config: {
          options: {
            debug: true,
            level: 2,
            timeout: 1000
          },
          items: [1, 2, 3, 4]
        },
        enabled: true
      })
    })
  })

  describe('deepmergeAll function', () => {
    it('should merge multiple objects', () => {
      const obj1 = { a: 1 }
      const obj2 = { b: 2 }
      const obj3 = { c: 3 }

      const result = deepmergeAll(obj1, obj2, obj3)

      expect(result).toEqual({
        a: 1,
        b: 2,
        c: 3
      })
    })

    it('should merge objects from left to right', () => {
      const obj1 = { a: 1, b: 1 }
      const obj2 = { b: 2, c: 2 }
      const obj3 = { c: 3, d: 3 }

      const result = deepmergeAll(obj1, obj2, obj3)

      expect(result).toEqual({
        a: 1,
        b: 2,
        c: 3,
        d: 3
      })
    })

    it('should return empty object when called with no arguments', () => {
      const result = deepmergeAll()
      expect(result).toEqual({})
    })

    it('should handle complex nested structures with multiple objects', () => {
      const obj1 = {
        config: {
          options: {
            debug: true
          }
        }
      }

      const obj2 = {
        config: {
          options: {
            level: 2
          },
          items: [1, 2]
        }
      }

      const obj3 = {
        config: {
          items: [3]
        },
        enabled: true
      }

      const result = deepmergeAll(obj1, obj2, obj3)

      expect(result).toEqual({
        config: {
          options: {
            debug: true,
            level: 2
          },
          items: [1, 2, 3]
        },
        enabled: true
      })
    })
  })
})
