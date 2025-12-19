import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

/**
 * ESLint configuration for @arts/utilities
 * Combines TypeScript, Prettier, and custom rules
 */
export default tseslint.config(
  eslint.configs.recommended,
  prettier,
  {
    ignores: [
      'node_modules/',
      'dist/',
      'coverage/',
      'coverage-report/',
      '__e2e__/',
      '__tests__/',
      'vendor/',
      'src/ts/www', // Ignore dev server files
      '.cache/' // Ignore build cache
    ]
  },
  {
    // Builder and config file settings
    files: ['vite.config.js', '__builder__/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        URL: 'readonly'
      }
    },
    rules: {
      'no-console': 'off'
    }
  },
  {
    // TypeScript-specific rules
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': ['off', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
)
