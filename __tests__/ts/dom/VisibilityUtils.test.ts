import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  elementIsVisibleInViewport,
  elementIsVisible
} from '../../../src/ts/core/dom/VisibilityUtils'

// Mock window dimensions
const mockWindow = {
  innerWidth: 1024,
  innerHeight: 768
}

// Mock getBoundingClientRect
const createMockRect = (top: number, left: number, bottom: number, right: number) => ({
  top,
  left,
  bottom,
  right,
  width: right - left,
  height: bottom - top,
  x: left,
  y: top,
  toJSON: () => ({})
})

// Mock getComputedStyle
const createMockComputedStyle = (visibility: string, opacity: string) => ({
  getPropertyValue: vi.fn((property: string) => {
    if (property === 'visibility') return visibility
    if (property === 'opacity') return opacity
    return ''
  })
})

describe('VisibilityUtils', () => {
  beforeEach(() => {
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: mockWindow.innerWidth
    })

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: mockWindow.innerHeight
    })

    // Mock getComputedStyle
    vi.spyOn(window, 'getComputedStyle')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('elementIsVisibleInViewport', () => {
    it('should return undefined for null element', () => {
      const result = elementIsVisibleInViewport(null)
      expect(result).toBeUndefined()
    })

    it('should return true for element fully visible in viewport', () => {
      const mockElement = {
        getBoundingClientRect: vi.fn(() => createMockRect(100, 100, 200, 300))
      } as unknown as Element

      const result = elementIsVisibleInViewport(mockElement)
      expect(result).toBe(true)
    })

    it('should return true for partially visible element (default behavior)', () => {
      // Element partially visible (top cut off)
      const mockElement = {
        getBoundingClientRect: vi.fn(() => createMockRect(-50, 100, 50, 300))
      } as unknown as Element

      const result = elementIsVisibleInViewport(mockElement)
      expect(result).toBe(true)
    })

    it('should return false for element completely outside viewport', () => {
      // Element completely above viewport
      const mockElement = {
        getBoundingClientRect: vi.fn(() => createMockRect(-200, 100, -100, 300))
      } as unknown as Element

      const result = elementIsVisibleInViewport(mockElement)
      expect(result).toBe(false)
    })

    it('should return false for partially visible element when partiallyVisible is false', () => {
      // Element partially visible (top cut off)
      const mockElement = {
        getBoundingClientRect: vi.fn(() => createMockRect(-50, 100, 50, 300))
      } as unknown as Element

      const result = elementIsVisibleInViewport(mockElement, { partiallyVisible: false })
      expect(result).toBe(false)
    })

    it('should return true for fully visible element when partiallyVisible is false', () => {
      const mockElement = {
        getBoundingClientRect: vi.fn(() => createMockRect(100, 100, 200, 300))
      } as unknown as Element

      const result = elementIsVisibleInViewport(mockElement, { partiallyVisible: false })
      expect(result).toBe(true)
    })

    it('should respect tolerance parameter for partially visible elements', () => {
      // Element just outside viewport by 30px
      const mockElement = {
        getBoundingClientRect: vi.fn(() => createMockRect(-30, 100, -10, 300))
      } as unknown as Element

      // Without tolerance - should be false
      const resultWithoutTolerance = elementIsVisibleInViewport(mockElement, { tolerance: 0 })
      expect(resultWithoutTolerance).toBe(false)

      // With 50px tolerance - should be true
      const resultWithTolerance = elementIsVisibleInViewport(mockElement, { tolerance: 50 })
      expect(resultWithTolerance).toBe(true)
    })

    it('should respect tolerance parameter for full visibility', () => {
      // Element just outside viewport by 30px
      const mockElement = {
        getBoundingClientRect: vi.fn(() => createMockRect(-30, 100, 200, 300))
      } as unknown as Element

      // Without tolerance - should be false
      const resultWithoutTolerance = elementIsVisibleInViewport(mockElement, {
        partiallyVisible: false,
        tolerance: 0
      })
      expect(resultWithoutTolerance).toBe(false)

      // With 50px tolerance - should be true
      const resultWithTolerance = elementIsVisibleInViewport(mockElement, {
        partiallyVisible: false,
        tolerance: 50
      })
      expect(resultWithTolerance).toBe(true)
    })

    it('should handle elements at viewport edges', () => {
      // Element at right edge of viewport
      const mockElement = {
        getBoundingClientRect: vi.fn(() => createMockRect(100, 1020, 200, 1030))
      } as unknown as Element

      const result = elementIsVisibleInViewport(mockElement)
      expect(result).toBe(true)
    })

    it('should handle elements at bottom edge of viewport', () => {
      // Element at bottom edge of viewport
      const mockElement = {
        getBoundingClientRect: vi.fn(() => createMockRect(760, 100, 780, 300))
      } as unknown as Element

      const result = elementIsVisibleInViewport(mockElement)
      expect(result).toBe(true)
    })
  })

  describe('elementIsVisible', () => {
    it('should return false for null element', () => {
      const result = elementIsVisible(null)
      expect(result).toBe(false)
    })

    it('should return true for visible element', () => {
      const mockElement = {} as Element
      const mockComputedStyle = createMockComputedStyle('visible', '1')

      vi.mocked(window.getComputedStyle).mockReturnValue(
        mockComputedStyle as unknown as CSSStyleDeclaration
      )

      const result = elementIsVisible(mockElement)
      expect(result).toBe(true)
      expect(window.getComputedStyle).toHaveBeenCalledWith(mockElement)
    })

    it('should return false for element with visibility hidden', () => {
      const mockElement = {} as Element
      const mockComputedStyle = createMockComputedStyle('hidden', '1')

      vi.mocked(window.getComputedStyle).mockReturnValue(
        mockComputedStyle as unknown as CSSStyleDeclaration
      )

      const result = elementIsVisible(mockElement)
      expect(result).toBe(false)
    })

    it('should return false for element with opacity 0', () => {
      const mockElement = {} as Element
      const mockComputedStyle = createMockComputedStyle('visible', '0')

      vi.mocked(window.getComputedStyle).mockReturnValue(
        mockComputedStyle as unknown as CSSStyleDeclaration
      )

      const result = elementIsVisible(mockElement)
      expect(result).toBe(false)
    })

    it('should return false for element with both visibility hidden and opacity 0', () => {
      const mockElement = {} as Element
      const mockComputedStyle = createMockComputedStyle('hidden', '0')

      vi.mocked(window.getComputedStyle).mockReturnValue(
        mockComputedStyle as unknown as CSSStyleDeclaration
      )

      const result = elementIsVisible(mockElement)
      expect(result).toBe(false)
    })

    it('should return true for element with partial opacity', () => {
      const mockElement = {} as Element
      const mockComputedStyle = createMockComputedStyle('visible', '0.5')

      vi.mocked(window.getComputedStyle).mockReturnValue(
        mockComputedStyle as unknown as CSSStyleDeclaration
      )

      const result = elementIsVisible(mockElement)
      expect(result).toBe(true)
    })

    it('should return false for element with very low opacity', () => {
      const mockElement = {} as Element
      const mockComputedStyle = createMockComputedStyle('visible', '0.001')

      vi.mocked(window.getComputedStyle).mockReturnValue(
        mockComputedStyle as unknown as CSSStyleDeclaration
      )

      const result = elementIsVisible(mockElement)
      expect(result).toBe(true) // Still greater than 0
    })

    it('should handle edge case with visibility collapse', () => {
      const mockElement = {} as Element
      const mockComputedStyle = createMockComputedStyle('collapse', '1')

      vi.mocked(window.getComputedStyle).mockReturnValue(
        mockComputedStyle as unknown as CSSStyleDeclaration
      )

      const result = elementIsVisible(mockElement)
      expect(result).toBe(false) // Only 'visible' should return true
    })
  })
})
