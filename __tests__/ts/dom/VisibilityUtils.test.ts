import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  elementIsVisibleInViewport,
  elementIsVisible,
  isElementFullscreen
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

    it('should correctly detect partial visibility when element left edge is outside but right edge is inside', () => {
      // Element that starts before the left edge of viewport but ends inside it
      const mockElement = {
        getBoundingClientRect: vi.fn(() => createMockRect(100, -50, 200, 50))
      } as unknown as Element

      const result = elementIsVisibleInViewport(mockElement, { partiallyVisible: true })
      expect(result).toBe(true) // Right edge is inside viewport, so partially visible
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

  describe('isElementFullscreen', () => {
    it('should return false for null element', () => {
      const result = isElementFullscreen(null)
      expect(result).toBe(false)
    })

    it('should return true for element that exactly matches viewport dimensions', () => {
      const mockElement = {
        getBoundingClientRect: vi.fn(() => ({
          width: 1024,
          height: 768,
          top: 0,
          left: 0,
          bottom: 768,
          right: 1024,
          x: 0,
          y: 0,
          toJSON: () => ({})
        }))
      } as unknown as Element

      const result = isElementFullscreen(mockElement)
      expect(result).toBe(true)
    })

    it('should return true for element within default tolerance (2px)', () => {
      const mockElement = {
        getBoundingClientRect: vi.fn(() => ({
          width: 1022, // 2px smaller than viewport
          height: 766, // 2px smaller than viewport
          top: 1, // 1px offset
          left: 1, // 1px offset
          bottom: 767,
          right: 1023,
          x: 1,
          y: 1,
          toJSON: () => ({})
        }))
      } as unknown as Element

      const result = isElementFullscreen(mockElement)
      expect(result).toBe(true)
    })

    it('should return false for element outside default tolerance', () => {
      const mockElement = {
        getBoundingClientRect: vi.fn(() => ({
          width: 1020, // 4px smaller than viewport (outside tolerance)
          height: 764, // 4px smaller than viewport (outside tolerance)
          top: 3, // 3px offset (outside tolerance)
          left: 3, // 3px offset (outside tolerance)
          bottom: 767,
          right: 1023,
          x: 3,
          y: 3,
          toJSON: () => ({})
        }))
      } as unknown as Element

      const result = isElementFullscreen(mockElement)
      expect(result).toBe(false)
    })

    it('should respect custom tolerance setting', () => {
      const mockElement = {
        getBoundingClientRect: vi.fn(() => ({
          width: 1014, // 10px smaller than viewport
          height: 758, // 10px smaller than viewport
          top: 5, // 5px offset
          left: 5, // 5px offset
          bottom: 763,
          right: 1019,
          x: 5,
          y: 5,
          toJSON: () => ({})
        }))
      } as unknown as Element

      // Should be false with default tolerance (2px)
      const resultDefault = isElementFullscreen(mockElement)
      expect(resultDefault).toBe(false)

      // Should be true with custom tolerance (10px)
      const resultCustom = isElementFullscreen(mockElement, { tolerance: 10 })
      expect(resultCustom).toBe(true)
    })

    it('should handle rounding when shouldRound is true (default)', () => {
      const mockElement = {
        getBoundingClientRect: vi.fn(() => ({
          width: 1024.7, // Will round to 1025
          height: 767.3, // Will round to 767
          top: 0.6, // Will round to 1
          left: 0.4, // Will round to 0
          bottom: 767.9,
          right: 1024.7,
          x: 0.4,
          y: 0.6,
          toJSON: () => ({})
        }))
      } as unknown as Element

      const result = isElementFullscreen(mockElement)
      expect(result).toBe(true) // Should be within tolerance after rounding
    })

    it('should not round when shouldRound is false', () => {
      const mockElement = {
        getBoundingClientRect: vi.fn(() => ({
          width: 1027.5, // Without rounding: |1027.5 - 1024| = 3.5 > 2 (tolerance)
          height: 771.5, // Without rounding: |771.5 - 768| = 3.5 > 2 (tolerance)
          top: 2.8, // Without rounding: |2.8| = 2.8 > 2 (tolerance)
          left: 2.8, // Without rounding: |2.8| = 2.8 > 2 (tolerance)
          bottom: 774.3,
          right: 1030.3,
          x: 2.8,
          y: 2.8,
          toJSON: () => ({})
        }))
      } as unknown as Element

      const result = isElementFullscreen(mockElement, { shouldRound: false })
      expect(result).toBe(false) // Should be outside tolerance without rounding
    })

    it('should handle zero tolerance for exact matching', () => {
      const mockElement = {
        getBoundingClientRect: vi.fn(() => ({
          width: 1024,
          height: 768,
          top: 0,
          left: 0,
          bottom: 768,
          right: 1024,
          x: 0,
          y: 0,
          toJSON: () => ({})
        }))
      } as unknown as Element

      const result = isElementFullscreen(mockElement, { tolerance: 0 })
      expect(result).toBe(true)

      // Even 1px off should fail with zero tolerance
      const mockElementOff = {
        getBoundingClientRect: vi.fn(() => ({
          width: 1023,
          height: 768,
          top: 0,
          left: 0,
          bottom: 768,
          right: 1023,
          x: 0,
          y: 0,
          toJSON: () => ({})
        }))
      } as unknown as Element

      const resultOff = isElementFullscreen(mockElementOff, { tolerance: 0 })
      expect(resultOff).toBe(false)
    })

    it('should handle large tolerance values', () => {
      const mockElement = {
        getBoundingClientRect: vi.fn(() => ({
          width: 500, // Much smaller than viewport
          height: 400, // Much smaller than viewport
          top: 100, // Offset from viewport
          left: 200, // Offset from viewport
          bottom: 500,
          right: 700,
          x: 200,
          y: 100,
          toJSON: () => ({})
        }))
      } as unknown as Element

      const result = isElementFullscreen(mockElement, { tolerance: 1000 })
      expect(result).toBe(true) // Should pass with very large tolerance
    })

    it('should work with different element types', () => {
      // Test with video element
      const videoElement = document.createElement('video')
      Object.defineProperty(videoElement, 'getBoundingClientRect', {
        value: vi.fn(() => ({
          width: 1024,
          height: 768,
          top: 0,
          left: 0,
          bottom: 768,
          right: 1024,
          x: 0,
          y: 0,
          toJSON: () => ({})
        }))
      })

      const result = isElementFullscreen(videoElement)
      expect(result).toBe(true)
    })

    it('should validate all four dimensions (width, height, top, left)', () => {
      // Test each dimension failing individually

      // Width too small
      const mockElementBadWidth = {
        getBoundingClientRect: vi.fn(() => ({
          width: 1000, // Too small
          height: 768,
          top: 0,
          left: 0,
          bottom: 768,
          right: 1000,
          x: 0,
          y: 0,
          toJSON: () => ({})
        }))
      } as unknown as Element

      expect(isElementFullscreen(mockElementBadWidth)).toBe(false)

      // Height too small
      const mockElementBadHeight = {
        getBoundingClientRect: vi.fn(() => ({
          width: 1024,
          height: 700, // Too small
          top: 0,
          left: 0,
          bottom: 700,
          right: 1024,
          x: 0,
          y: 0,
          toJSON: () => ({})
        }))
      } as unknown as Element

      expect(isElementFullscreen(mockElementBadHeight)).toBe(false)

      // Top too far from 0
      const mockElementBadTop = {
        getBoundingClientRect: vi.fn(() => ({
          width: 1024,
          height: 768,
          top: 10, // Too far from 0
          left: 0,
          bottom: 778,
          right: 1024,
          x: 0,
          y: 10,
          toJSON: () => ({})
        }))
      } as unknown as Element

      expect(isElementFullscreen(mockElementBadTop)).toBe(false)

      // Left too far from 0
      const mockElementBadLeft = {
        getBoundingClientRect: vi.fn(() => ({
          width: 1024,
          height: 768,
          top: 0,
          left: 10, // Too far from 0
          bottom: 768,
          right: 1034,
          x: 10,
          y: 0,
          toJSON: () => ({})
        }))
      } as unknown as Element

      expect(isElementFullscreen(mockElementBadLeft)).toBe(false)
    })

    it('should handle combined options correctly', () => {
      const mockElement = {
        getBoundingClientRect: vi.fn(() => ({
          width: 1019.7, // Will round to 1020 with shouldRound: true
          height: 763.3, // Will round to 763 with shouldRound: true
          top: 2.6, // Will round to 3 with shouldRound: true
          left: 1.4, // Will round to 1 with shouldRound: true
          bottom: 766.9,
          right: 1021.1,
          x: 1.4,
          y: 2.6,
          toJSON: () => ({})
        }))
      } as unknown as Element

      // Should pass with rounding and tolerance 5
      const result = isElementFullscreen(mockElement, {
        shouldRound: true,
        tolerance: 5
      })
      expect(result).toBe(true)

      // Test with values that should fail without rounding but pass with rounding
      const mockElement2 = {
        getBoundingClientRect: vi.fn(() => ({
          width: 1018.2, // Will round to 1018, |1018 - 1024| = 6 > 5 (tolerance)
          height: 762.2, // Will round to 762, |762 - 768| = 6 > 5 (tolerance)
          top: 5.8, // Will round to 6, |6| = 6 > 5 (tolerance)
          left: 5.8, // Will round to 6, |6| = 6 > 5 (tolerance)
          bottom: 768,
          right: 1024,
          x: 5.8,
          y: 5.8,
          toJSON: () => ({})
        }))
      } as unknown as Element

      // Should fail without rounding and tolerance 5
      const resultNoRound = isElementFullscreen(mockElement2, {
        shouldRound: false,
        tolerance: 5
      })
      expect(resultNoRound).toBe(false)
    })
  })
})
