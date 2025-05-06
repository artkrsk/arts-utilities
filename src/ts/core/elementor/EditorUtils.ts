import type { TElementorSettings, TSettingsMap, TValueMapping } from '../types'

/**
 * Extracts keys from an object recursively
 * @param obj - The object to extract keys from
 * @param keys - Array to collect the extracted keys
 */
function extractFromObject(obj: any, keys: string[]): void {
  if (typeof obj === 'string') {
    keys.push(obj)
  } else if (typeof obj === 'object' && obj !== null) {
    // Extract condition keys
    if ('condition' in obj) {
      keys.push(obj['condition'])
    }

    // Extract value keys
    if ('value' in obj) {
      if (typeof obj['value'] === 'string') {
        keys.push(obj['value'])
      } else if (typeof obj['value'] === 'object') {
        extractFromObject(obj['value'], keys)
      }
    } else {
      // Process object keys if no value property
      Object.values(obj).forEach((val) => extractFromObject(val, keys))
    }
  }
}

/**
 * Helper function to process complex nested values
 * @param valueMapping - The value mapping object or string
 * @param settings - The Elementor settings object
 * @returns Processed values
 */
export const processComplexValue = (
  valueMapping: TValueMapping,
  settings: TElementorSettings
): any => {
  if (typeof valueMapping === 'string') {
    // For simple string mappings, get the value directly
    return settings[valueMapping]
  }

  const result: Record<string, any> = {}

  Object.entries(valueMapping).forEach(([key, mapping]) => {
    if (typeof mapping === 'string') {
      // Simple string mapping - get the value directly
      result[key] = settings[mapping]
    } else if (typeof mapping === 'object') {
      // Handle nested objects with value property
      if ('value' in mapping) {
        const value = settings[mapping['value'] as string]

        // Check if we need to extract size or return whole value
        if (mapping['return_size'] === false) {
          // When return_size is explicitly false, use the whole value
          if (value && typeof value === 'object' && value.size !== undefined && value.unit) {
            // Format with unit when available (like for scale)
            result[key] = `${value.size}${value.unit}`
          } else {
            result[key] = value
          }
        } else if (value && typeof value === 'object' && value.size !== undefined) {
          // Otherwise, return just the size value for objects with size property
          result[key] = value.size
        } else {
          // Fallback to whole value for simple types
          result[key] = value
        }
      } else {
        // Recursive processing for nested objects
        result[key] = processComplexValue(mapping, settings)
      }
    }
  })

  return result
}

/**
 * Converts Elementor settings to a format usable by JavaScript
 * @param settings - The Elementor settings object
 * @param settingsMap - Mapping of JS keys to Elementor keys
 * @returns Converted settings object
 */
export const convertSettings = (
  settings: TElementorSettings,
  settingsMap: TSettingsMap
): Record<string, any> => {
  const result: Record<string, any> = {}

  // Process each property in the map
  Object.entries(settingsMap).forEach(([jsKey, elementorMapping]) => {
    // Simple string mapping
    if (typeof elementorMapping === 'string') {
      if (settings[elementorMapping] !== undefined) {
        result[jsKey] = settings[elementorMapping]
      }
    }
    // Complex mapping with condition and value
    else if (typeof elementorMapping === 'object') {
      // Check if this is a conditional mapping
      if ('condition' in elementorMapping) {
        // Set property to false if condition is not met
        if (!settings[elementorMapping['condition']]) {
          result[jsKey] = false
          return
        }
      }

      // Handle simple value field
      if ('value' in elementorMapping && typeof elementorMapping['value'] === 'string') {
        const value = settings[elementorMapping['value']]

        // Extract size for values with "size" property when return_size is true
        if (
          elementorMapping['return_size'] === true &&
          value &&
          typeof value === 'object' &&
          value.size !== undefined
        ) {
          result[jsKey] = value.size
        } else {
          result[jsKey] = value
        }
      }
      // Handle complex nested object
      else if ('value' in elementorMapping && typeof elementorMapping['value'] === 'object') {
        result[jsKey] = processComplexValue(elementorMapping['value'], settings)
      }
    }
  })

  return result
}

/**
 * Extracts settings keys from a settings map
 * @param settingsMap - The settings map object
 * @param additionalSettings - Additional settings to include
 * @returns Array of setting keys
 */
export const getLiveSettings = (
  settingsMap: TSettingsMap = {},
  additionalSettings: string[] = []
): string[] => {
  const keys: string[] = []

  // Extract keys from the settings map
  Object.values(settingsMap).forEach((mapping) => extractFromObject(mapping, keys))

  // Combine extracted keys with additional settings and remove duplicates
  return [...new Set([...keys, ...additionalSettings])]
}
