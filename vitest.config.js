import { defineConfig } from 'vitest/config'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Vitest configuration for @arts/utilities
 */
export default defineConfig({
  test: {
    // Test environment setup
    environment: 'jsdom',

    // TypeScript setup files
    setupFiles: ['__tests__/ts/setup.ts'],

    // Module resolution for TypeScript
    resolve: {
      alias: {
        '@core': resolve(__dirname, 'src/ts/core'),
        '@utils': resolve(__dirname, 'src/ts/utils'),
        '@interfaces': resolve(__dirname, 'src/ts/core/interfaces'),
        '@types': resolve(__dirname, 'src/ts/core/types'),
        '@constants': resolve(__dirname, 'src/ts/core/constants')
      }
    },

    // Coverage configuration
    coverage: {
      include: ['src/ts/**/*.ts'],
      exclude: [
        'src/ts/**/*.cy.ts',
        'src/ts/**/interfaces/*.ts',
        'src/ts/**/types/*.ts',
        'src/ts/**/constants/*.ts',
        'src/ts/www/**/*',
        'node_modules/',
        '**/*.d.ts',
        '**/index.ts' // Exclude all barrel index.ts files
      ]
    }
  }
})
