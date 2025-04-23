/**
 * Project Configuration for @arts/utilities
 * A collection of useful PHP and JS utility functions for developing a WordPress theme
 */
export default {
  // Basic project information
  name: 'ArtsUtilities',
  globalName: 'ArtsUtilities',
  entry: './src/ts/index.ts',

  // Path configuration
  paths: {
    root: './',
    src: './src',
    dist: './dist',
    aliases: {
      '@core': './src/ts/core',
      '@utils': './src/ts/utils',
      '@interfaces': './src/ts/core/interfaces',
      '@types': './src/ts/core/types',
      '@constants': './src/ts/core/constants'
    }
  },

  dependencies: {
    essential: ['depcheck', 'npm-check-updates', '@vitest/coverage-v8']
  },

  // Development configuration
  dev: {
    root: './src/ts/www',
    server: {
      port: 8080,
      host: 'localhost'
    }
  },

  // WordPress sync configuration
  wordpress: {
    enabled: false,
    source: './src/php',
    extensions: ['.js', '.css', '.php', '.jsx', '.ts', '.tsx'],
    targets: [],
    debug: false
  },

  // Build configuration
  build: {
    formats: ['esm', 'cjs', 'umd'],
    target: 'es2018',
    sourcemap: false,
    externals: {},
    globals: {},
    cleanOutputDir: true,

    // Output filenames by format
    output: {
      esm: 'index.mjs',
      cjs: 'index.cjs',
      umd: 'index.umd.js',
      iife: 'index.iife.js'
    }
  },

  // Unified targets configuration
  targets: {
    // Which format goes where
    formats: {
      umd: ['static'],
      esm: ['static'],
      cjs: ['static']
    }
  },

  // Testing configuration
  testing: {
    environment: 'jsdom',
    setupFiles: ['__tests__/ts/setup.ts'],
    include: ['**/__tests__/**/*.test.ts'],
    tsconfig: './tsconfig.test.json',
    coverage: {
      reporter: ['text', 'html', 'lcov'],
      include: ['src/ts/**/*.ts'],
      exclude: [
        'src/ts/**/interfaces/*.ts',
        'src/ts/**/types/*.ts',
        'src/ts/**/constants/*.ts',
        'src/ts/www/**/*',
        'node_modules/',
        '**/*.d.ts'
      ]
    }
  },

  // Cypress configuration
  cypress: {
    baseUrl: 'http://localhost:8080',
    e2eSpecPattern: '__e2e__/**/*.cy.{js,ts}',
    componentSpecPattern: 'src/ts/**/*.cy.ts',
    supportFile: '__e2e__/support/e2e.js',
    fixturesFolder: 'fixtures',
    video: false,
    allowedPaths: ['cypress/fixtures', 'src/ts/components']
  },

  // Linting configuration
  linting: {
    ignorePatterns: ['node_modules/', 'dist/', 'coverage/'],
    ignoreTests: false,
    allowConsole: false,
    requireExplicitReturnTypes: true,
    allowAny: false,
    tsRules: {
      '@typescript-eslint/no-non-null-assertion': 'error',
      'no-debugger': 'error'
    },
    buildFiles: ['__builder__/**/*.js']
  },

  // Watch options
  watchOptions: {
    ignored: ['**/node_modules/**', '**/dist/**']
  }
}
