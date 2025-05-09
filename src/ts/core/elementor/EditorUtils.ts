import type { TElementorSettings, TSettingsMap, TValueMapping } from '../types'

declare global {
  interface Window {
    elementorFrontend?: {
      isEditMode: () => boolean
    }
    elementor?: Object
  }
}

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
    // Complex mapping (object)
    else if (typeof elementorMapping === 'object' && elementorMapping !== null) {
      // Handle conditional mapping: if a 'condition' is specified and not met,
      // set the result for this key to false and skip further processing for this item.
      if ('condition' in elementorMapping && typeof elementorMapping.condition === 'string') {
        if (!settings[elementorMapping.condition]) {
          result[jsKey] = false
          return // Equivalent to 'continue' for the forEach loop
        }
      }

      // If the mapping object has a 'value' property, it defines how to extract/transform the value.
      if ('value' in elementorMapping) {
        const valueProperty = elementorMapping.value // This is TComplexElementorMapping['value']

        if (typeof valueProperty === 'string') {
          const settingValue = settings[valueProperty]
          // If 'return_size' is true (and part of elementorMapping), extract .size
          if (
            elementorMapping.return_size === true &&
            settingValue &&
            typeof settingValue === 'object' &&
            settingValue.size !== undefined
          ) {
            result[jsKey] = settingValue.size
          } else {
            result[jsKey] = settingValue
          }
        } else if (typeof valueProperty === 'object' && valueProperty !== null) {
          // If 'value' is an object, it's a TValueMapping; process with processComplexValue.
          result[jsKey] = processComplexValue(valueProperty as TValueMapping, settings)
        }
        // If 'value' exists but isn't string/object (e.g. null), result[jsKey] remains undefined based on current logic.
      }
      // If the mapping object does not have a 'value' property, it's treated as a nested TSettingsMap.
      else {
        // This handles structures like 'lenisOptions', which are direct nested maps.
        // Assumes any 'condition' (if present) was met to reach this point.
        result[jsKey] = convertSettings(settings, elementorMapping as TSettingsMap)
      }
    }
    // Other types for elementorMapping (e.g. number, boolean, or null if not caught by `elementorMapping !== null`) are implicitly ignored.
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

// Track if we're already waiting for Elementor initialization
let elementorInitPromise: Promise<boolean> | null = null

/**
 * Async function that resolves when Elementor editor is loaded
 * @returns Promise that resolves to boolean indicating if in Elementor editor
 */
export const elementorEditorLoaded = async (): Promise<boolean> => {
  // If Elementor is already initialized, check immediately
  if (typeof window !== 'undefined' && window.elementorFrontend) {
    return window.elementorFrontend.isEditMode()
  }

  // If window is undefined, we're not in a browser
  if (typeof window === 'undefined') {
    return false
  }

  // If we're already waiting for initialization, return the existing promise
  if (elementorInitPromise) {
    return elementorInitPromise
  }

  // Create a new promise waiting for initialization
  elementorInitPromise = new Promise<boolean>((resolve) => {
    // Listen for initialization
    window.addEventListener('elementor/frontend/init', () => {
      elementorInitPromise = null
      if (window.elementorFrontend) {
        resolve(window.elementorFrontend.isEditMode())
      } else {
        resolve(false)
      }
    })
  })

  return elementorInitPromise
}
