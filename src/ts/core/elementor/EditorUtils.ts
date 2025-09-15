import type { TElementorSettings, TSettingsMap, TValueMapping } from '../types/TEditorUtils'
import type { ElementorFrontend, ElementorEditor } from '@arts/elementor-types'
import { isCSSValue } from '@arts/elementor-types'

// Type for the Window object with Elementor properties
interface ElementorWindow extends Window {
  elementorFrontend?: ElementorFrontend
  elementor?: ElementorEditor
}

// Helper to get properly typed window
const getElementorWindow = (): ElementorWindow => window as ElementorWindow

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
 * Processes complex nested value mappings between Elementor settings and component options.
 * Handles various mapping patterns including simple strings, nested objects, size extraction,
 * and conditional value processing.
 *
 * @param valueMapping - The mapping configuration (string for simple mapping, object for complex)
 * @param settings - The raw Elementor settings object
 * @returns Processed value(s) according to the mapping configuration
 *
 * @example
 * ```typescript
 * // Example 1: Simple string mapping
 * const settings = { color: '#ff0000' };
 * const result = processComplexValue('color', settings);
 * // Result: '#ff0000'
 *
 * // Example 2: Size value extraction
 * const settings = { margin: { size: 20, unit: 'px' } };
 * const result = processComplexValue({
 *   value: 'margin'
 * }, settings);
 * // Result: 20 (just the size value)
 *
 * // Example 3: Full value with unit
 * const result = processComplexValue({
 *   value: 'margin',
 *   return_size: false
 * }, settings);
 * // Result: '20px' (formatted with unit)
 *
 * // Example 4: Nested object mapping
 * const settings = {
 *   desktop_margin: { size: 20, unit: 'px' },
 *   mobile_margin: { size: 10, unit: 'px' }
 * };
 * const result = processComplexValue({
 *   desktop: { value: 'desktop_margin' },
 *   mobile: { value: 'mobile_margin' }
 * }, settings);
 * // Result: { desktop: 20, mobile: 10 }
 * ```
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
          if (isCSSValue(value)) {
            // Format with unit when available using proper type guard
            result[key] = `${value.size}${value.unit}`
          } else {
            result[key] = value
          }
        } else if (isCSSValue(value)) {
          // Otherwise, return just the size value for CSS value objects
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
 * Converts raw Elementor settings to a component-friendly configuration object.
 * This is the main function for transforming Elementor's flat setting structure
 * into organized, typed configuration objects that components can consume.
 *
 * Features:
 * - Handles conditional settings (only include if condition is met)
 * - Supports complex nested value extraction
 * - Processes responsive settings (desktop/tablet/mobile)
 * - Extracts size values from Elementor dimension objects
 * - Provides fallback handling for missing settings
 *
 * @param settings - Raw Elementor settings object from the editor
 * @param settingsMap - Configuration mapping object defining how to transform settings
 * @returns Converted settings object ready for component consumption
 *
 * @example
 * ```typescript
 * // Example 1: Basic setting conversion
 * const elementorSettings = {
 *   show_dots: 'yes',
 *   dot_color: '#ffffff',
 *   slides_count: '3'
 * };
 *
 * const settingsMap = {
 *   showDots: 'show_dots',
 *   dotColor: 'dot_color',
 *   slidesCount: 'slides_count'
 * };
 *
 * const result = convertSettings(elementorSettings, settingsMap);
 * // Result: { showDots: 'yes', dotColor: '#ffffff', slidesCount: '3' }
 *
 * // Example 2: Conditional settings
 * const settingsMap = {
 *   autoplay: 'enable_autoplay',
 *   autoplaySpeed: {
 *     condition: 'enable_autoplay',
 *     value: 'autoplay_speed'
 *   }
 * };
 * // autoplaySpeed only included if enable_autoplay is truthy
 *
 * // Example 3: Responsive settings
 * const settingsMap = {
 *   columns: {
 *     desktop: 'columns',
 *     tablet: 'columns_tablet',
 *     mobile: 'columns_mobile'
 *   }
 * };
 * // Creates nested object: { columns: { desktop: 4, tablet: 2, mobile: 1 } }
 *
 * // Example 4: Size extraction from Elementor dimensions
 * const elementorSettings = {
 *   item_spacing: { size: 20, unit: 'px' }
 * };
 * const settingsMap = {
 *   spacing: { value: 'item_spacing' } // Extracts just the size (20)
 * };
 * ```
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
            isCSSValue(settingValue)
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
  if (typeof window !== 'undefined' && getElementorWindow().elementorFrontend?.elementsHandler) {
    return getElementorWindow().elementorFrontend!.isEditMode()
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
      if (getElementorWindow().elementorFrontend?.elementsHandler) {
        resolve(getElementorWindow().elementorFrontend!.isEditMode())
      } else {
        resolve(false)
      }
    })
  })

  return elementorInitPromise
}
