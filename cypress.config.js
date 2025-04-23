import { defineConfig } from 'cypress'
import projectConfig from './project.config.js'
import { builder } from './__builder__/src/index.js'
import getCypressConfig from './__builder__/src/testing/cypress-config-base.js'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// ESM to CommonJS path conversion
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Get unified Cypress configuration for @arts/utilities
 * Merges project-specific settings with base builder config
 */
function config() {
  return getCypressConfig(projectConfig, {
    // Direct builder reference for components testing
    builder: builder,

    // Absolute path to ensure proper module resolution
    index: resolve(__dirname, './__builder__/src/index.js')
  })
}

/**
 * Cypress configuration for ArtsUtilities
 * Sets up both component and E2E testing environments
 */
export default defineConfig({
  // Component testing configuration
  component: {
    ...config().component,
    devServer: config().component.devServer
  },
  // E2E testing configuration
  e2e: {
    ...config().e2e,
    setupNodeEvents(on, config) {
      return config
    }
  }
})
