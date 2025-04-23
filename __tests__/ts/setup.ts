import { vi, beforeAll, afterAll } from 'vitest'

// Extend DOM interfaces
declare global {
  // interface Window {}
}

// Silence console errors during tests
beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterAll(() => {
  vi.restoreAllMocks()
})
