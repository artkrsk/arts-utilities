/**
 * Development-specific configuration overrides for @arts/utilities
 * @param {Object} baseConfig - The base configuration object
 * @returns {Object} - Modified configuration for development
 */
export default function (baseConfig) {
  // Create a deep copy to avoid modifying the original
  const config = JSON.parse(JSON.stringify(baseConfig))

  // Development-specific settings
  config.build.sourcemap = true
  config.build.minify = false
  config.build.dropConsole = false

  // Unified targets configuration for development
  config.targets.development = {
    // Static HTML targets (for all formats)
    static: [
      // Add your static development paths here
    ]
  }

  // Set as current environment
  config.currentEnvironment = 'development'

  return config
}
