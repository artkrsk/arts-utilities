import { vi, beforeAll, afterAll } from 'vitest'
import type { ElementorFrontend, ElementorEditor } from '@arts/elementor-types'

// Extend DOM interfaces with proper Elementor types
declare global {
  interface Window {
    elementorFrontend?: ElementorFrontend
    elementor?: ElementorEditor
  }
}

// Silence console errors during tests
beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterAll(() => {
  vi.restoreAllMocks()
})
