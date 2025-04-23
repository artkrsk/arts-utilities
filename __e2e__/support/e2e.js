import ArtsUtilities from '../../src/ts/core/app'

// Import commands
import './commands'

// Set up global before each test
beforeEach(() => {
  cy.visit('/index.html', {
    onBeforeLoad(win) {
      win.ArtsUtilities = ArtsUtilities
    }
  })
})