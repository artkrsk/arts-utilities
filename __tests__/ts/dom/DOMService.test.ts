import { describe, it, expect, beforeEach } from 'vitest'
import { DOMService } from '../../../src/ts/core/dom/DOMService'

describe('DOMService', () => {
  // Setup DOM elements for testing
  let rootElement: HTMLElement
  let childElement: HTMLElement
  let innerChildElement: HTMLElement

  beforeEach(() => {
    // Create test DOM structure
    document.body.innerHTML = ''

    rootElement = document.createElement('div')
    rootElement.id = 'root'
    rootElement.classList.add('container')

    childElement = document.createElement('div')
    childElement.id = 'child'
    childElement.setAttribute('data-test', 'test-value')
    childElement.classList.add('item')

    innerChildElement = document.createElement('span')
    innerChildElement.id = 'inner-child'
    innerChildElement.classList.add('inner')
    innerChildElement.textContent = 'Test content'

    childElement.appendChild(innerChildElement)
    rootElement.appendChild(childElement)
    document.body.appendChild(rootElement)
  })

  describe('querySelector', () => {
    it('should find an element by selector', () => {
      const element = DOMService.querySelector(document, '#child')
      expect(element).toBe(childElement)
    })

    it('should return null when no element matches the selector', () => {
      const element = DOMService.querySelector(document, '#non-existent')
      expect(element).toBeNull()
    })

    it('should return null when selector is empty', () => {
      const element = DOMService.querySelector(document, '')
      expect(element).toBeNull()
    })

    it('should limit search to the provided scope', () => {
      const element = DOMService.querySelector(rootElement, '#inner-child')
      expect(element).toBe(innerChildElement)

      // Won't find elements outside the scope
      const outsideElement = document.createElement('div')
      outsideElement.id = 'outside'
      document.body.appendChild(outsideElement)

      const result = DOMService.querySelector(rootElement, '#outside')
      expect(result).toBeNull()
    })

    it('should return null when scope is invalid', () => {
      // @ts-ignore - Testing with invalid scope
      const element = DOMService.querySelector(null, '#child')
      expect(element).toBeNull()

      // @ts-ignore - Testing with invalid scope
      const element2 = DOMService.querySelector({}, '#child')
      expect(element2).toBeNull()
    })

    it('should handle errors gracefully', () => {
      // @ts-ignore - Force error by using invalid selector
      const element = DOMService.querySelector(document, '###')
      expect(element).toBeNull()
    })
  })

  describe('querySelectorAll', () => {
    it('should find all elements matching the selector', () => {
      // Add another element with the same class
      const anotherElement = document.createElement('div')
      anotherElement.classList.add('item')
      rootElement.appendChild(anotherElement)

      const elements = DOMService.querySelectorAll(document, '.item')
      expect(elements).toHaveLength(2)
      expect(elements).toContain(childElement)
      expect(elements).toContain(anotherElement)
    })

    it('should return empty array when no elements match', () => {
      const elements = DOMService.querySelectorAll(document, '.non-existent')
      expect(elements).toEqual([])
    })

    it('should return empty array when selector is empty', () => {
      const elements = DOMService.querySelectorAll(document, '')
      expect(elements).toEqual([])
    })

    it('should handle errors gracefully', () => {
      // @ts-ignore - Force error with invalid selector
      const elements = DOMService.querySelectorAll(document, '###')
      expect(elements).toEqual([])
    })
  })

  describe('getAttribute', () => {
    it('should get attribute value', () => {
      const value = DOMService.getAttribute(childElement, 'data-test')
      expect(value).toBe('test-value')
    })

    it('should return null for non-existent attributes', () => {
      const value = DOMService.getAttribute(childElement, 'non-existent')
      expect(value).toBeNull()
    })

    it('should return null when attribute name is empty', () => {
      const value = DOMService.getAttribute(childElement, '')
      expect(value).toBeNull()
    })

    it('should handle errors gracefully', () => {
      try {
        // @ts-ignore - Testing with invalid args
        const value = DOMService.getAttribute(null, 'data-test')
        expect(value).toBeNull()
      } catch (error) {
        // Should not throw
        expect(true).toBe(false)
      }
    })
  })

  describe('matches', () => {
    it('should return true when element matches selector', () => {
      const matches = DOMService.matches(childElement, '.item')
      expect(matches).toBe(true)
    })

    it('should return false when element does not match selector', () => {
      const matches = DOMService.matches(childElement, '.non-existent')
      expect(matches).toBe(false)
    })

    it('should return false when selector is empty', () => {
      const matches = DOMService.matches(childElement, '')
      expect(matches).toBe(false)
    })

    it('should handle errors gracefully', () => {
      // @ts-ignore - Force error with invalid selector
      const matches = DOMService.matches(childElement, '###')
      expect(matches).toBe(false)
    })
  })

  describe('contains', () => {
    it('should return true when element contains another element', () => {
      const contains = DOMService.contains(rootElement, childElement)
      expect(contains).toBe(true)

      const containsInner = DOMService.contains(rootElement, innerChildElement)
      expect(containsInner).toBe(true)
    })

    it('should return false when element does not contain another element', () => {
      const outsideElement = document.createElement('div')
      document.body.appendChild(outsideElement)

      const contains = DOMService.contains(rootElement, outsideElement)
      expect(contains).toBe(false)
    })

    it('should return false when either element is null', () => {
      // @ts-ignore - Testing with invalid args
      const contains1 = DOMService.contains(null, childElement)
      expect(contains1).toBe(false)

      // @ts-ignore - Testing with invalid args
      const contains2 = DOMService.contains(rootElement, null)
      expect(contains2).toBe(false)
    })

    it('should handle errors gracefully', () => {
      try {
        // @ts-ignore - Force error with invalid args
        const contains = DOMService.contains({}, {})
        expect(contains).toBe(false)
      } catch (error) {
        // Should not throw
        expect(true).toBe(false)
      }
    })
  })

  describe('getDocument', () => {
    it('should return document', () => {
      const result = DOMService.getDocument()
      expect(result).toBe(document)
    })
  })

  describe('getDocumentElement', () => {
    it('should return document.documentElement', () => {
      const result = DOMService.getDocumentElement()
      expect(result).toBe(document.documentElement)
    })
  })

  describe('getBodyElement', () => {
    it('should return document.body', () => {
      const result = DOMService.getBodyElement()
      expect(result).toBe(document.body)
    })
  })

  describe('addClass', () => {
    it('should add class to element', () => {
      expect(childElement.classList.contains('new-class')).toBe(false)

      DOMService.addClass(childElement, 'new-class')
      expect(childElement.classList.contains('new-class')).toBe(true)
    })

    it('should handle null element gracefully', () => {
      // @ts-ignore - Testing with invalid args
      expect(() => DOMService.addClass(null, 'test')).not.toThrow()
    })

    it('should handle empty className gracefully', () => {
      expect(() => DOMService.addClass(childElement, '')).not.toThrow()
    })

    it('should handle errors gracefully', () => {
      // Create a mock element that throws an error on classList.add
      const mockElement = {
        classList: {
          add: () => {
            throw new Error('Test error')
          }
        }
      }

      // @ts-ignore - Testing with mock element
      expect(() => DOMService.addClass(mockElement, 'test')).not.toThrow()
    })
  })

  describe('removeClass', () => {
    it('should remove class from element', () => {
      childElement.classList.add('to-remove')
      expect(childElement.classList.contains('to-remove')).toBe(true)

      DOMService.removeClass(childElement, 'to-remove')
      expect(childElement.classList.contains('to-remove')).toBe(false)
    })

    it('should handle null element gracefully', () => {
      // @ts-ignore - Testing with invalid args
      expect(() => DOMService.removeClass(null, 'test')).not.toThrow()
    })

    it('should handle empty className gracefully', () => {
      expect(() => DOMService.removeClass(childElement, '')).not.toThrow()
    })

    it('should handle errors gracefully', () => {
      // Create a mock element that throws an error on classList.remove
      const mockElement = {
        classList: {
          remove: () => {
            throw new Error('Test error')
          }
        }
      }

      // @ts-ignore - Testing with mock element
      expect(() => DOMService.removeClass(mockElement, 'test')).not.toThrow()
    })
  })

  describe('toggleClass', () => {
    it('should toggle class on element', () => {
      // Initially no 'test' class
      expect(childElement.classList.contains('test')).toBe(false)

      // Toggle on
      const result1 = DOMService.toggleClass(childElement, 'test')
      expect(result1).toBe(true)
      expect(childElement.classList.contains('test')).toBe(true)

      // Toggle off
      const result2 = DOMService.toggleClass(childElement, 'test')
      expect(result2).toBe(false)
      expect(childElement.classList.contains('test')).toBe(false)
    })

    it('should force add class when force is true', () => {
      expect(childElement.classList.contains('forced')).toBe(false)

      const result1 = DOMService.toggleClass(childElement, 'forced', true)
      expect(result1).toBe(true)
      expect(childElement.classList.contains('forced')).toBe(true)

      // Force true again - should remain true
      const result2 = DOMService.toggleClass(childElement, 'forced', true)
      expect(result2).toBe(true)
      expect(childElement.classList.contains('forced')).toBe(true)
    })

    it('should force remove class when force is false', () => {
      childElement.classList.add('to-remove')
      expect(childElement.classList.contains('to-remove')).toBe(true)

      const result1 = DOMService.toggleClass(childElement, 'to-remove', false)
      expect(result1).toBe(false)
      expect(childElement.classList.contains('to-remove')).toBe(false)

      // Force false again - should remain false
      const result2 = DOMService.toggleClass(childElement, 'to-remove', false)
      expect(result2).toBe(false)
      expect(childElement.classList.contains('to-remove')).toBe(false)
    })

    it('should return false for invalid arguments', () => {
      // @ts-ignore - Testing with invalid args
      const result1 = DOMService.toggleClass(null, 'test')
      expect(result1).toBe(false)

      const result2 = DOMService.toggleClass(childElement, '')
      expect(result2).toBe(false)

      // @ts-ignore - Testing with invalid args
      const result3 = DOMService.toggleClass(childElement, null)
      expect(result3).toBe(false)
    })

    it('should handle errors gracefully', () => {
      // Create a mock element that throws an error on classList.toggle
      const mockElement = {
        classList: {
          toggle: () => {
            throw new Error('Test error')
          }
        }
      }

      // @ts-ignore - Testing with mock element
      const result = DOMService.toggleClass(mockElement, 'test')
      expect(result).toBe(false)
    })
  })

  describe('toggleClasses', () => {
    it('should toggle multiple space-separated classes', () => {
      // Initially no classes
      expect(childElement.classList.contains('class1')).toBe(false)
      expect(childElement.classList.contains('class2')).toBe(false)
      expect(childElement.classList.contains('class3')).toBe(false)

      // Toggle multiple classes on
      const results1 = DOMService.toggleClasses(childElement, 'class1 class2 class3')
      expect(results1).toEqual([true, true, true])
      expect(childElement.classList.contains('class1')).toBe(true)
      expect(childElement.classList.contains('class2')).toBe(true)
      expect(childElement.classList.contains('class3')).toBe(true)

      // Toggle them off
      const results2 = DOMService.toggleClasses(childElement, 'class1 class2 class3')
      expect(results2).toEqual([false, false, false])
      expect(childElement.classList.contains('class1')).toBe(false)
      expect(childElement.classList.contains('class2')).toBe(false)
      expect(childElement.classList.contains('class3')).toBe(false)
    })

    it('should handle CSS selector format with dots', () => {
      // Test with dot-prefixed class names
      const results = DOMService.toggleClasses(childElement, '.btn .btn-primary .active')
      expect(results).toEqual([true, true, true])
      expect(childElement.classList.contains('btn')).toBe(true)
      expect(childElement.classList.contains('btn-primary')).toBe(true)
      expect(childElement.classList.contains('active')).toBe(true)
    })

    it('should handle mixed format with extra whitespace', () => {
      const results = DOMService.toggleClasses(
        childElement,
        '  .container   main-content   .active  '
      )
      expect(results).toEqual([true, true, true])
      expect(childElement.classList.contains('container')).toBe(true)
      expect(childElement.classList.contains('main-content')).toBe(true)
      expect(childElement.classList.contains('active')).toBe(true)
    })

    it('should force add all classes when force is true', () => {
      // Add one class manually first
      childElement.classList.add('class2')

      const results = DOMService.toggleClasses(childElement, 'class1 class2 class3', true)
      expect(results).toEqual([true, true, true])
      expect(childElement.classList.contains('class1')).toBe(true)
      expect(childElement.classList.contains('class2')).toBe(true)
      expect(childElement.classList.contains('class3')).toBe(true)
    })

    it('should force remove all classes when force is false', () => {
      // Add classes manually first
      childElement.classList.add('class1', 'class2', 'class3')

      const results = DOMService.toggleClasses(childElement, 'class1 class2 class3', false)
      expect(results).toEqual([false, false, false])
      expect(childElement.classList.contains('class1')).toBe(false)
      expect(childElement.classList.contains('class2')).toBe(false)
      expect(childElement.classList.contains('class3')).toBe(false)
    })

    it('should return empty array for invalid arguments', () => {
      // @ts-ignore - Testing with invalid args
      const result1 = DOMService.toggleClasses(null, 'test')
      expect(result1).toEqual([])

      const result2 = DOMService.toggleClasses(childElement, '')
      expect(result2).toEqual([])

      // @ts-ignore - Testing with invalid args
      const result3 = DOMService.toggleClasses(childElement, null)
      expect(result3).toEqual([])
    })

    it('should handle empty string input', () => {
      const results = DOMService.toggleClasses(childElement, '   ')
      expect(results).toEqual([])
    })

    it('should handle single class name', () => {
      const results = DOMService.toggleClasses(childElement, 'single-class')
      expect(results).toEqual([true])
      expect(childElement.classList.contains('single-class')).toBe(true)
    })

    it('should handle errors gracefully', () => {
      // Create a mock element that throws an error on classList.toggle
      const mockElement = {
        classList: {
          toggle: () => {
            throw new Error('Test error')
          }
        }
      }

      // @ts-ignore - Testing with mock element
      const results = DOMService.toggleClasses(mockElement, 'test1 test2')
      expect(results).toEqual([false, false])
    })

    it('should work with existing classes', () => {
      // Start with some existing classes
      childElement.classList.add('existing1', 'existing3')

      const results = DOMService.toggleClasses(childElement, 'existing1 new-class existing3')
      expect(results).toEqual([false, true, false]) // existing1: off, new-class: on, existing3: off
      expect(childElement.classList.contains('existing1')).toBe(false)
      expect(childElement.classList.contains('new-class')).toBe(true)
      expect(childElement.classList.contains('existing3')).toBe(false)
    })
  })

  describe('closest', () => {
    it('should find the closest ancestor matching the selector', () => {
      // Add ancestor class to rootElement (which is already a parent of childElement)
      rootElement.classList.add('ancestor')

      const element = DOMService.closest(childElement, '.ancestor')
      expect(element).toBe(rootElement)
    })

    it('should return null if no ancestor matches', () => {
      const element = DOMService.closest(childElement, '.non-existent')
      expect(element).toBeNull()
    })

    it('should return null if selector is empty', () => {
      const element = DOMService.closest(childElement, '')
      expect(element).toBeNull()
    })

    it('should handle errors gracefully', () => {
      // @ts-ignore - Force error with invalid selector
      const element = DOMService.closest(childElement, '###')
      expect(element).toBeNull()
    })
  })
})
