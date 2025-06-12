import { describe, it, expect, beforeEach } from 'vitest'
import { isHTMLElement } from '../../../src/ts/core/dom/ElementUtils'

// Mock classes for testing prototype chain traversal
class MockElement {
  nodeType = 1
  constructor() {
    this.nodeType = 1
  }
}

class MockHTMLElement extends MockElement {
  constructor() {
    super()
  }
}

class MockHTMLDivElement extends MockHTMLElement {
  constructor() {
    super()
  }
}

class MockHTMLInputElement extends MockHTMLElement {
  constructor() {
    super()
  }
}

class MockNode {
  nodeType = 3 // Text node
}

describe('ElementUtils', () => {
  describe('isHTMLElement', () => {
    it('should return false for null or undefined', () => {
      expect(isHTMLElement(null)).toBe(false)
      expect(isHTMLElement(undefined)).toBe(false)
    })

    it('should return false for primitive types', () => {
      expect(isHTMLElement('string')).toBe(false)
      expect(isHTMLElement(123)).toBe(false)
      expect(isHTMLElement(true)).toBe(false)
      expect(isHTMLElement(Symbol('test'))).toBe(false)
    })

    it('should return false for plain objects', () => {
      expect(isHTMLElement({})).toBe(false)
      expect(isHTMLElement({ key: 'value' })).toBe(false)
      expect(isHTMLElement([])).toBe(false)
    })

    it('should return false for functions', () => {
      expect(isHTMLElement(() => {})).toBe(false)
      expect(isHTMLElement(function () {})).toBe(false)
    })

    it('should detect elements by nodeType fallback', () => {
      const elementWithNodeType = { nodeType: 1 }
      expect(isHTMLElement(elementWithNodeType)).toBe(true)
    })

    it('should return false for non-element nodes', () => {
      const textNode = { nodeType: 3 } // Text node
      const commentNode = { nodeType: 8 } // Comment node
      const documentNode = { nodeType: 9 } // Document node

      expect(isHTMLElement(textNode)).toBe(false)
      expect(isHTMLElement(commentNode)).toBe(false)
      expect(isHTMLElement(documentNode)).toBe(false)
    })

    it('should detect elements with proper constructor names', () => {
      const mockElement = new MockElement()
      expect(isHTMLElement(mockElement, 'MockElement')).toBe(true)
    })

    it('should traverse prototype chain correctly', () => {
      const mockDiv = new MockHTMLDivElement()

      // Should find specific type
      expect(isHTMLElement(mockDiv, 'MockHTMLDivElement')).toBe(true)

      // Should find parent types in prototype chain
      expect(isHTMLElement(mockDiv, 'MockHTMLElement')).toBe(true)
      expect(isHTMLElement(mockDiv, 'MockElement')).toBe(true)

      // Should not find unrelated types
      expect(isHTMLElement(mockDiv, 'MockHTMLInputElement')).toBe(false)
    })

    it('should use default typeName of "Element"', () => {
      const mockElement = new MockElement()
      expect(isHTMLElement(mockElement)).toBe(true) // Uses nodeType fallback

      // Test with object that has Element in prototype chain
      const elementWithProperConstructor = Object.create(null)
      elementWithProperConstructor.constructor = { name: 'Element' }
      Object.setPrototypeOf(elementWithProperConstructor, { constructor: { name: 'Element' } })

      expect(isHTMLElement(elementWithProperConstructor)).toBe(true)
    })

    it('should handle objects with missing constructors', () => {
      const objectWithoutConstructor = Object.create(null)
      expect(isHTMLElement(objectWithoutConstructor)).toBe(false)
    })

    it('should handle objects with null prototypes', () => {
      const objectWithNullProto = Object.create(null)
      objectWithNullProto.nodeType = 1
      expect(isHTMLElement(objectWithNullProto)).toBe(false) // No prototype chain to traverse
    })

    it('should handle deep prototype chains', () => {
      // The algorithm only checks constructors on prototypes, not on the object itself
      // So for child to match 'Child', 'Child' must be on child's prototype
      const grandParent = {
        constructor: { name: 'GrandParent' }
      }
      const parent = {
        constructor: { name: 'Parent' }
      }
      const child = {
        constructor: { name: 'Child' }
      }

      // Set up prototype chain where each object's name is on its prototype
      Object.setPrototypeOf(parent, grandParent)
      Object.setPrototypeOf(child, parent)

      // child should match 'Parent' (child's immediate prototype)
      expect(isHTMLElement(child, 'Parent')).toBe(true)
      // child should match 'GrandParent' (parent's prototype)
      expect(isHTMLElement(child, 'GrandParent')).toBe(true)
      // child won't match 'Child' because that's on child itself, not its prototype
      expect(isHTMLElement(child, 'Child')).toBe(false)
      expect(isHTMLElement(child, 'NonExistent')).toBe(false)
    })

    it('should handle circular prototype chains gracefully', () => {
      // Test that the function doesn't crash with complex prototype chains
      const obj1 = {
        constructor: { name: 'Test1' }
      }
      const obj2 = {
        constructor: { name: 'Test2' }
      }

      Object.setPrototypeOf(obj1, obj2)

      // Should not get stuck in infinite loop and should work correctly
      // obj1 will match 'Test2' because that's on obj2 (obj1's prototype)
      expect(isHTMLElement(obj1, 'Test2')).toBe(true) // obj2.constructor.name (obj1's prototype)
      expect(isHTMLElement(obj1, 'Test1')).toBe(false) // Test1 is on obj1 itself, not its prototype
      expect(isHTMLElement(obj1, 'NonExistent')).toBe(false)
    })

    it('should work with real DOM elements if available', () => {
      // Only test with real DOM if in browser environment
      if (typeof document !== 'undefined') {
        const div = document.createElement('div')
        const span = document.createElement('span')
        const input = document.createElement('input')

        expect(isHTMLElement(div)).toBe(true)
        expect(isHTMLElement(span)).toBe(true)
        expect(isHTMLElement(input)).toBe(true)

        expect(isHTMLElement(div, 'HTMLDivElement')).toBe(true)
        expect(isHTMLElement(span, 'HTMLSpanElement')).toBe(true)
        expect(isHTMLElement(input, 'HTMLInputElement')).toBe(true)

        // Cross-type checks should fail
        expect(isHTMLElement(div, 'HTMLSpanElement')).toBe(false)
        expect(isHTMLElement(span, 'HTMLInputElement')).toBe(false)
      }
    })

    it('should handle edge cases with constructor names', () => {
      const tests = [
        {
          obj: { constructor: { name: '' } },
          typeName: '',
          expected: true
        },
        {
          obj: { constructor: { name: 'Element' } },
          typeName: 'Element',
          expected: true
        },
        {
          obj: { constructor: null },
          typeName: 'Element',
          expected: false
        },
        {
          obj: { constructor: undefined },
          typeName: 'Element',
          expected: false
        }
      ]

      tests.forEach(({ obj, typeName, expected }) => {
        Object.setPrototypeOf(obj, { constructor: obj.constructor })
        expect(isHTMLElement(obj, typeName)).toBe(expected)
      })
    })

    it('should prioritize constructor name over nodeType for specific types', () => {
      const mockObject = {
        nodeType: 1,
        constructor: { name: 'SpecificType' }
      }
      Object.setPrototypeOf(mockObject, { constructor: mockObject.constructor })

      expect(isHTMLElement(mockObject, 'SpecificType')).toBe(true)
      expect(isHTMLElement(mockObject, 'DifferentType')).toBe(false) // No fallback for non-Element types
      expect(isHTMLElement(mockObject, 'Element')).toBe(true) // nodeType fallback works for 'Element'
    })
  })
})
