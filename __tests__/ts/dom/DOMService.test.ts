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
})
