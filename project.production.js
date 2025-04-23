/**
 * Production-specific configuration overrides for @arts/utilities
 * @param {Object} baseConfig - The base configuration object
 * @returns {Object} - Modified configuration for production
 */
export default function (baseConfig) {
  // Create a deep copy to avoid modifying the original
  const config = JSON.parse(JSON.stringify(baseConfig))

  // Production-specific settings
  config.build.sourcemap = false
  config.build.minify = true
  config.build.minifyIdentifiers = true
  config.build.minifySyntax = true
  config.build.minifyWhitespace = true
  config.build.dropConsole = true
  config.build.legalComments = 'none'

  // Unified targets configuration for production
  config.targets.production = {
    // Static HTML targets (for all formats)
    static: []
  }

  // Set as current environment
  config.currentEnvironment = 'production'

  return config
}
