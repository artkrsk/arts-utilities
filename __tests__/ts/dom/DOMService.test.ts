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

  describe('hasAttribute', () => {
    it('should return true for existing attributes', () => {
      const hasAttribute = DOMService.hasAttribute(childElement, 'data-test')
      expect(hasAttribute).toBe(true)

      const hasId = DOMService.hasAttribute(childElement, 'id')
      expect(hasId).toBe(true)
    })

    it('should return false for non-existent attributes', () => {
      const hasAttribute = DOMService.hasAttribute(childElement, 'non-existent')
      expect(hasAttribute).toBe(false)
    })

    it('should return false when attribute name is empty', () => {
      const hasAttribute = DOMService.hasAttribute(childElement, '')
      expect(hasAttribute).toBe(false)
    })

    it('should return false when attribute name is undefined', () => {
      const hasAttribute = DOMService.hasAttribute(childElement, undefined)
      expect(hasAttribute).toBe(false)
    })

    it('should handle boolean attributes correctly', () => {
      // Add a boolean attribute
      const input = document.createElement('input')
      input.setAttribute('required', '')
      input.setAttribute('disabled', 'disabled')
      document.body.appendChild(input)

      expect(DOMService.hasAttribute(input, 'required')).toBe(true)
      expect(DOMService.hasAttribute(input, 'disabled')).toBe(true)
      expect(DOMService.hasAttribute(input, 'checked')).toBe(false)
    })

    it('should handle errors gracefully', () => {
      try {
        // @ts-ignore - Testing with invalid args
        const hasAttribute = DOMService.hasAttribute(null, 'data-test')
        expect(hasAttribute).toBe(false)
      } catch (error) {
        // Should not throw
        expect(true).toBe(false)
      }
    })
  })

  describe('setAttribute', () => {
    it('should set attribute on element', () => {
      DOMService.setAttribute(childElement, 'data-new', 'new-value')
      expect(childElement.getAttribute('data-new')).toBe('new-value')
    })

    it('should update existing attribute', () => {
      expect(childElement.getAttribute('data-test')).toBe('test-value')

      DOMService.setAttribute(childElement, 'data-test', 'updated-value')
      expect(childElement.getAttribute('data-test')).toBe('updated-value')
    })

    it('should set boolean attributes with empty string', () => {
      const input = document.createElement('input')
      document.body.appendChild(input)

      DOMService.setAttribute(input, 'required', '')
      expect(input.hasAttribute('required')).toBe(true)
      expect(input.getAttribute('required')).toBe('')

      DOMService.setAttribute(input, 'disabled', '')
      expect(input.hasAttribute('disabled')).toBe(true)
    })

    it('should set accessibility attributes', () => {
      const button = document.createElement('button')
      document.body.appendChild(button)

      DOMService.setAttribute(button, 'aria-pressed', 'false')
      expect(button.getAttribute('aria-pressed')).toBe('false')

      DOMService.setAttribute(button, 'aria-label', 'Toggle menu')
      expect(button.getAttribute('aria-label')).toBe('Toggle menu')
    })

    it('should set data attributes', () => {
      DOMService.setAttribute(childElement, 'data-config', '{"theme": "dark"}')
      expect(childElement.getAttribute('data-config')).toBe('{"theme": "dark"}')

      DOMService.setAttribute(childElement, 'data-widget-id', '12345')
      expect(childElement.getAttribute('data-widget-id')).toBe('12345')
    })

    it('should handle null element gracefully', () => {
      // @ts-ignore - Testing with null element
      expect(() => DOMService.setAttribute(null, 'test', 'value')).not.toThrow()
    })

    it('should handle empty attribute name gracefully', () => {
      expect(() => DOMService.setAttribute(childElement, '', 'value')).not.toThrow()
    })

    it('should handle undefined attribute name gracefully', () => {
      expect(() => DOMService.setAttribute(childElement, undefined, 'value')).not.toThrow()
    })

    it('should handle undefined value gracefully', () => {
      expect(() => DOMService.setAttribute(childElement, 'test', undefined)).not.toThrow()
      // Should not set the attribute when value is undefined
      expect(childElement.hasAttribute('test')).toBe(false)
    })

    it('should handle numeric values as strings', () => {
      DOMService.setAttribute(childElement, 'data-count', '42')
      expect(childElement.getAttribute('data-count')).toBe('42')

      DOMService.setAttribute(childElement, 'tabindex', '0')
      expect(childElement.getAttribute('tabindex')).toBe('0')
    })

    it('should handle special characters in values', () => {
      const specialValue = 'value with spaces & symbols: <>&"\'`'
      DOMService.setAttribute(childElement, 'data-special', specialValue)
      expect(childElement.getAttribute('data-special')).toBe(specialValue)
    })

    it('should work with different element types', () => {
      const img = document.createElement('img')
      const link = document.createElement('a')
      const input = document.createElement('input')

      document.body.appendChild(img)
      document.body.appendChild(link)
      document.body.appendChild(input)

      DOMService.setAttribute(img, 'src', 'image.jpg')
      DOMService.setAttribute(img, 'alt', 'Test image')

      DOMService.setAttribute(link, 'href', 'https://example.com')
      DOMService.setAttribute(link, 'target', '_blank')

      DOMService.setAttribute(input, 'type', 'email')
      DOMService.setAttribute(input, 'placeholder', 'Enter email')

      expect(img.getAttribute('src')).toBe('image.jpg')
      expect(img.getAttribute('alt')).toBe('Test image')
      expect(link.getAttribute('href')).toBe('https://example.com')
      expect(link.getAttribute('target')).toBe('_blank')
      expect(input.getAttribute('type')).toBe('email')
      expect(input.getAttribute('placeholder')).toBe('Enter email')
    })

    it('should handle errors gracefully', () => {
      // Create a mock element that throws an error on setAttribute
      const mockElement = {
        setAttribute: () => {
          throw new Error('Test error')
        }
      }

      // @ts-ignore - Testing with mock element
      expect(() => DOMService.setAttribute(mockElement, 'test', 'value')).not.toThrow()
    })
  })

  describe('html', () => {
    it('should get HTML content from element', () => {
      childElement.innerHTML = '<span>Test Content</span>'
      const content = DOMService.html(childElement)
      expect(content).toBe('<span>Test Content</span>')
    })

    it('should set HTML content to element', () => {
      const newContent = '<p>New Content</p><div>More content</div>'
      DOMService.html(childElement, newContent)
      expect(childElement.innerHTML).toBe(newContent)
    })

    it('should clear content when setting empty string', () => {
      childElement.innerHTML = '<span>Some content</span>'
      expect(childElement.innerHTML).toBe('<span>Some content</span>')

      DOMService.html(childElement, '')
      expect(childElement.innerHTML).toBe('')
    })

    it('should return empty string when getting content from null element', () => {
      // @ts-ignore - Testing with null element
      const content = DOMService.html(null)
      expect(content).toBe('')
    })

    it('should return undefined when setting content on null element', () => {
      // @ts-ignore - Testing with null element
      const result = DOMService.html(null, '<p>test</p>')
      expect(result).toBeUndefined()
    })

    it('should handle complex HTML content', () => {
      const complexHtml = `
        <div class="card">
          <h3>Title</h3>
          <p>Description with <strong>bold</strong> and <em>italic</em> text.</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      `

      DOMService.html(childElement, complexHtml)
      expect(childElement.innerHTML).toBe(complexHtml)

      const retrieved = DOMService.html(childElement)
      expect(retrieved).toBe(complexHtml)
    })

    it('should handle getting content with nested elements', () => {
      // Set up nested structure
      childElement.innerHTML = ''
      const wrapper = document.createElement('div')
      wrapper.className = 'wrapper'

      const title = document.createElement('h2')
      title.textContent = 'Test Title'

      const paragraph = document.createElement('p')
      paragraph.innerHTML = 'Text with <a href="#">link</a>'

      wrapper.appendChild(title)
      wrapper.appendChild(paragraph)
      childElement.appendChild(wrapper)

      const content = DOMService.html(childElement)
      expect(content).toContain('<div class="wrapper">')
      expect(content).toContain('<h2>Test Title</h2>')
      expect(content).toContain('<a href="#">link</a>')
    })

    it('should handle errors gracefully when getting content', () => {
      // Create a mock element that throws an error on innerHTML getter
      const mockElement = {
        get innerHTML() {
          throw new Error('Test error')
        }
      }

      // @ts-ignore - Testing with mock element
      const content = DOMService.html(mockElement)
      expect(content).toBe('')
    })

    it('should handle errors gracefully when setting content', () => {
      // Create a mock element that throws an error on innerHTML setter
      const mockElement = {
        set innerHTML(value: string) {
          throw new Error('Test error')
        }
      }

      // @ts-ignore - Testing with mock element
      const result = DOMService.html(mockElement, '<p>test</p>')
      expect(result).toBeUndefined()
    })

    it('should work with different element types', () => {
      const div = document.createElement('div')
      const span = document.createElement('span')
      const section = document.createElement('section')

      document.body.appendChild(div)
      document.body.appendChild(span)
      document.body.appendChild(section)

      // Test with different elements
      DOMService.html(div, '<p>Div content</p>')
      DOMService.html(span, '<strong>Span content</strong>')
      DOMService.html(section, '<article>Section content</article>')

      expect(DOMService.html(div)).toBe('<p>Div content</p>')
      expect(DOMService.html(span)).toBe('<strong>Span content</strong>')
      expect(DOMService.html(section)).toBe('<article>Section content</article>')
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

  describe('createElement', () => {
    it('should create a new element with the specified tag name', () => {
      const div = DOMService.createElement('div')
      expect(div).toBeInstanceOf(HTMLDivElement)
      expect(div.tagName).toBe('DIV')
    })

    it('should create different types of elements', () => {
      const span = DOMService.createElement('span')
      expect(span).toBeInstanceOf(HTMLSpanElement)
      expect(span.tagName).toBe('SPAN')

      const button = DOMService.createElement('button')
      expect(button).toBeInstanceOf(HTMLButtonElement)
      expect(button.tagName).toBe('BUTTON')

      const input = DOMService.createElement('input')
      expect(input).toBeInstanceOf(HTMLInputElement)
      expect(input.tagName).toBe('INPUT')

      const img = DOMService.createElement('img')
      expect(img).toBeInstanceOf(HTMLImageElement)
      expect(img.tagName).toBe('IMG')

      const a = DOMService.createElement('a')
      expect(a).toBeInstanceOf(HTMLAnchorElement)
      expect(a.tagName).toBe('A')
    })

    it('should create elements that can be configured immediately', () => {
      const link = DOMService.createElement('a')
      DOMService.setAttribute(link, 'href', 'https://example.com')
      DOMService.setAttribute(link, 'target', '_blank')

      expect(link.getAttribute('href')).toBe('https://example.com')
      expect(link.getAttribute('target')).toBe('_blank')
    })

    it('should create form elements with proper types', () => {
      const form = DOMService.createElement('form')
      expect(form).toBeInstanceOf(HTMLFormElement)

      const fieldset = DOMService.createElement('fieldset')
      expect(fieldset).toBeInstanceOf(HTMLFieldSetElement)

      const legend = DOMService.createElement('legend')
      expect(legend).toBeInstanceOf(HTMLLegendElement)

      const label = DOMService.createElement('label')
      expect(label).toBeInstanceOf(HTMLLabelElement)

      const textarea = DOMService.createElement('textarea')
      expect(textarea).toBeInstanceOf(HTMLTextAreaElement)

      const select = DOMService.createElement('select')
      expect(select).toBeInstanceOf(HTMLSelectElement)

      const option = DOMService.createElement('option')
      expect(option).toBeInstanceOf(HTMLOptionElement)
    })

    it('should create semantic HTML elements', () => {
      const article = DOMService.createElement('article')
      expect(article).toBeInstanceOf(HTMLElement)
      expect(article.tagName).toBe('ARTICLE')

      const header = DOMService.createElement('header')
      expect(header).toBeInstanceOf(HTMLElement)
      expect(header.tagName).toBe('HEADER')

      const footer = DOMService.createElement('footer')
      expect(footer).toBeInstanceOf(HTMLElement)
      expect(footer.tagName).toBe('FOOTER')

      const nav = DOMService.createElement('nav')
      expect(nav).toBeInstanceOf(HTMLElement)
      expect(nav.tagName).toBe('NAV')

      const section = DOMService.createElement('section')
      expect(section).toBeInstanceOf(HTMLElement)
      expect(section.tagName).toBe('SECTION')

      const main = DOMService.createElement('main')
      expect(main).toBeInstanceOf(HTMLElement)
      expect(main.tagName).toBe('MAIN')
    })

    it('should create list elements', () => {
      const ul = DOMService.createElement('ul')
      expect(ul).toBeInstanceOf(HTMLUListElement)

      const ol = DOMService.createElement('ol')
      expect(ol).toBeInstanceOf(HTMLOListElement)

      const li = DOMService.createElement('li')
      expect(li).toBeInstanceOf(HTMLLIElement)
    })

    it('should create table elements', () => {
      const table = DOMService.createElement('table')
      expect(table).toBeInstanceOf(HTMLTableElement)

      const thead = DOMService.createElement('thead')
      expect(thead).toBeInstanceOf(HTMLTableSectionElement)

      const tbody = DOMService.createElement('tbody')
      expect(tbody).toBeInstanceOf(HTMLTableSectionElement)

      const tfoot = DOMService.createElement('tfoot')
      expect(tfoot).toBeInstanceOf(HTMLTableSectionElement)

      const tr = DOMService.createElement('tr')
      expect(tr).toBeInstanceOf(HTMLTableRowElement)

      const td = DOMService.createElement('td')
      expect(td).toBeInstanceOf(HTMLTableCellElement)

      const th = DOMService.createElement('th')
      expect(th).toBeInstanceOf(HTMLTableCellElement)
    })

    it('should throw error for empty tag name', () => {
      expect(() => DOMService.createElement('')).toThrow('Tag name is required')
    })

    it('should throw error for invalid tag name', () => {
      expect(() => DOMService.createElement('invalid-tag-with-###')).toThrow(
        'Failed to create element with tag name'
      )
    })
  })

  describe('appendChild', () => {
    it('should append a child element to a parent element', () => {
      const parent = DOMService.createElement('div')
      const child = DOMService.createElement('span')

      const result = DOMService.appendChild(parent, child)

      expect(result).toBe(child)
      expect(parent.children).toHaveLength(1)
      expect(parent.children[0]).toBe(child)
      expect(child.parentElement).toBe(parent)
    })

    it('should append multiple children to the same parent', () => {
      const parent = DOMService.createElement('div')
      const child1 = DOMService.createElement('span')
      const child2 = DOMService.createElement('p')
      const child3 = DOMService.createElement('button')

      DOMService.appendChild(parent, child1)
      DOMService.appendChild(parent, child2)
      DOMService.appendChild(parent, child3)

      expect(parent.children).toHaveLength(3)
      expect(parent.children[0]).toBe(child1)
      expect(parent.children[1]).toBe(child2)
      expect(parent.children[2]).toBe(child3)
    })

    it('should work with elements from the DOM', () => {
      const newChild = DOMService.createElement('p')
      DOMService.html(newChild, 'New paragraph')

      const result = DOMService.appendChild(rootElement, newChild)

      expect(result).toBe(newChild)
      expect(rootElement.children).toHaveLength(2) // Original child + new child
      expect(rootElement.children[1]).toBe(newChild)
      expect(newChild.textContent).toBe('New paragraph')
    })

    it('should build complex nested structures', () => {
      const card = DOMService.createElement('div')
      DOMService.addClass(card, 'card')

      const cardHeader = DOMService.createElement('div')
      DOMService.addClass(cardHeader, 'card-header')
      const title = DOMService.createElement('h3')
      DOMService.html(title, 'Card Title')
      DOMService.appendChild(cardHeader, title)

      const cardBody = DOMService.createElement('div')
      DOMService.addClass(cardBody, 'card-body')
      const content = DOMService.createElement('p')
      DOMService.html(content, 'Card content goes here.')
      DOMService.appendChild(cardBody, content)

      DOMService.appendChild(card, cardHeader)
      DOMService.appendChild(card, cardBody)

      expect(card.children).toHaveLength(2)
      expect(card.children[0]).toBe(cardHeader)
      expect(card.children[1]).toBe(cardBody)
      expect(cardHeader.children[0]).toBe(title)
      expect(cardBody.children[0]).toBe(content)
      expect(title.textContent).toBe('Card Title')
      expect(content.textContent).toBe('Card content goes here.')
    })

    it('should create forms dynamically', () => {
      const form = DOMService.createElement('form')
      const fieldset = DOMService.createElement('fieldset')
      const legend = DOMService.createElement('legend')
      DOMService.html(legend, 'User Information')
      DOMService.appendChild(fieldset, legend)

      const emailField = DOMService.createElement('input')
      DOMService.setAttribute(emailField, 'type', 'email')
      DOMService.setAttribute(emailField, 'name', 'email')
      DOMService.setAttribute(emailField, 'placeholder', 'Enter email')
      DOMService.appendChild(fieldset, emailField)

      const submitBtn = DOMService.createElement('button')
      DOMService.setAttribute(submitBtn, 'type', 'submit')
      DOMService.html(submitBtn, 'Submit')
      DOMService.appendChild(fieldset, submitBtn)

      DOMService.appendChild(form, fieldset)

      expect(form.children[0]).toBe(fieldset)
      expect(fieldset.children).toHaveLength(3)
      expect(fieldset.children[0]).toBe(legend)
      expect(fieldset.children[1]).toBe(emailField)
      expect(fieldset.children[2]).toBe(submitBtn)
      expect(emailField.getAttribute('type')).toBe('email')
      expect(submitBtn.textContent).toBe('Submit')
    })

    it('should create navigation menus', () => {
      const nav = DOMService.createElement('nav')
      const ul = DOMService.createElement('ul')

      const menuItems = ['Home', 'About', 'Services', 'Contact']
      menuItems.forEach((item) => {
        const li = DOMService.createElement('li')
        const link = DOMService.createElement('a')
        DOMService.setAttribute(link, 'href', `/${item.toLowerCase()}`)
        DOMService.html(link, item)
        DOMService.appendChild(li, link)
        DOMService.appendChild(ul, li)
      })

      DOMService.appendChild(nav, ul)

      expect(nav.children[0]).toBe(ul)
      expect(ul.children).toHaveLength(4)

      const firstLink = ul.children[0].children[0] as HTMLAnchorElement
      expect(firstLink.href).toContain('/home')
      expect(firstLink.textContent).toBe('Home')

      const lastLink = ul.children[3].children[0] as HTMLAnchorElement
      expect(lastLink.href).toContain('/contact')
      expect(lastLink.textContent).toBe('Contact')
    })

    it('should work with different element types', () => {
      const table = DOMService.createElement('table')
      const thead = DOMService.createElement('thead')
      const tbody = DOMService.createElement('tbody')
      const tr = DOMService.createElement('tr')
      const td = DOMService.createElement('td')

      DOMService.html(td, 'Cell content')
      DOMService.appendChild(tr, td)
      DOMService.appendChild(tbody, tr)
      DOMService.appendChild(table, thead)
      DOMService.appendChild(table, tbody)

      expect(table.children).toHaveLength(2)
      expect(table.children[0]).toBe(thead)
      expect(table.children[1]).toBe(tbody)
      expect(tbody.children[0]).toBe(tr)
      expect(tr.children[0]).toBe(td)
      expect(td.textContent).toBe('Cell content')
    })

    it('should handle moving elements between parents', () => {
      const parent1 = DOMService.createElement('div')
      const parent2 = DOMService.createElement('div')
      const child = DOMService.createElement('span')

      // Append to first parent
      DOMService.appendChild(parent1, child)
      expect(parent1.children).toHaveLength(1)
      expect(parent2.children).toHaveLength(0)
      expect(child.parentElement).toBe(parent1)

      // Move to second parent
      DOMService.appendChild(parent2, child)
      expect(parent1.children).toHaveLength(0)
      expect(parent2.children).toHaveLength(1)
      expect(child.parentElement).toBe(parent2)
    })

    it('should throw error when parent is null', () => {
      const child = DOMService.createElement('span')
      // @ts-ignore - Testing with null parent
      expect(() => DOMService.appendChild(null, child)).toThrow(
        'Both parent and child elements are required'
      )
    })

    it('should throw error when child is null', () => {
      const parent = DOMService.createElement('div')
      // @ts-ignore - Testing with null child
      expect(() => DOMService.appendChild(parent, null)).toThrow(
        'Both parent and child elements are required'
      )
    })

    it('should throw error when both parent and child are null', () => {
      // @ts-ignore - Testing with null elements
      expect(() => DOMService.appendChild(null, null)).toThrow(
        'Both parent and child elements are required'
      )
    })
  })
})
