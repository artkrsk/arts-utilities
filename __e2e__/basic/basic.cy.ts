/// <reference types="cypress" />

/**
 * E2E test for @arts/utilities
 */
describe('ArtsUtilities E2E', () => {
  beforeEach(() => {
    // Visit the page where your library is loaded
    cy.visit('/')
  })

  it('should load ArtsUtilities correctly', () => {
    // This is a simple E2E test example
    // Replace with actual test logic for your library's functionality
    cy.window().then((win) => {
      // Check if library is available on window
      expect(win['ArtsUtilities']).to.exist
    })
  })

  it('should handle library functionality', () => {
    cy.window().then((win) => {
      // Example test for library functionality
      // Replace with actual tests for your library
      const result = win['ArtsUtilities'].method()
      expect(result).to.equal('Hello, World!')
    })
  })
})
