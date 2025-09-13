import type { Utils } from '@arts/elementor-types'

/**
 * Type representing Elementor widget/element settings as a key-value record.
 * Settings are typically retrieved from Elementor widgets and contain configuration values.
 * Now using the standardized ElementSettings type from @arts/elementor-types.
 *
 * @example
 * ```typescript
 * const widgetSettings: TElementorSettings = {
 *   title: 'My Widget Title',
 *   color: '#ff0000',
 *   margin: { size: 20, unit: 'px' },
 *   enable_feature: true
 * }
 * ```
 */
export type TElementorSettings = Utils.ElementSettings

/**
 * Type for individual Elementor setting values.
 * Can be primitives like strings, numbers, booleans, or complex objects.
 * Updated to support all Elementor value types including responsive values, CSS values, etc.
 *
 * @example
 * ```typescript
 * const titleValue: TElementorSettingValue = 'Header Title'
 * const colorValue: TElementorSettingValue = '#3498db'
 * const enabledValue: TElementorSettingValue = true
 * const sizeValue: TElementorSettingValue = 24
 * const cssValue: TElementorSettingValue = { size: 20, unit: 'px' }
 * ```
 */
export type TElementorSettingValue = any

/**
 * Type for Elementor setting keys/names.
 * Represents the string key used to identify a setting in the settings object.
 *
 * @example
 * ```typescript
 * const titleKey: TElementorSetting = 'widget_title'
 * const colorKey: TElementorSetting = 'background_color'
 * const marginKey: TElementorSetting = 'margin_top'
 * ```
 */
export type TElementorSetting = string

/**
 * Complex mapping value type for transforming Elementor settings.
 * Used in settings conversion to define how values should be processed.
 *
 * @property value - Source setting key or nested mapping object
 * @property return_size - Whether to extract size value from Elementor size objects
 * @property condition - Setting key that must be truthy for this mapping to apply
 *
 * @example
 * ```typescript
 * const simpleMapping: TMappingValue = {
 *   value: 'elementor_color_setting'
 * }
 *
 * const sizeMapping: TMappingValue = {
 *   value: 'elementor_margin_setting',
 *   return_size: true // Extract .size from { size: 20, unit: 'px' }
 * }
 *
 * const conditionalMapping: TMappingValue = {
 *   value: 'feature_color',
 *   condition: 'enable_feature' // Only apply if enable_feature is truthy
 * }
 *
 * const nestedMapping: TMappingValue = {
 *   desktop: { value: 'desktop_margin' },
 *   mobile: { value: 'mobile_margin' }
 * }
 * ```
 */
export type TMappingValue = Record<string, any> & {
  value?: string | Record<string, any>
  return_size?: boolean
  condition?: string
}

/**
 * Settings map type for defining Elementor to JavaScript setting conversions.
 * Maps output setting names to either simple string keys or complex mapping objects.
 *
 * @example
 * ```typescript
 * const settingsMap: TSettingsMap = {
 *   // Simple string mapping
 *   title: 'widget_title',
 *
 *   // Complex object mapping with size extraction
 *   fontSize: {
 *     value: 'typography_font_size',
 *     return_size: true
 *   },
 *
 *   // Conditional mapping
 *   animationColor: {
 *     value: 'animation_color',
 *     condition: 'enable_animation'
 *   },
 *
 *   // Nested responsive mapping
 *   spacing: {
 *     desktop: { value: 'spacing_desktop' },
 *     mobile: { value: 'spacing_mobile' }
 *   }
 * }
 * ```
 */
export type TSettingsMap = Record<string, string | TMappingValue>

/**
 * Value mapping type for flexible setting transformations.
 * Can be a simple string key or complex nested mapping objects.
 *
 * @example
 * ```typescript
 * // Simple value mapping
 * const simpleMapping: TValueMapping = 'source_setting_key'
 *
 * // Complex nested mapping
 * const complexMapping: TValueMapping = {
 *   primary: 'primary_color_setting',
 *   secondary: {
 *     light: 'secondary_light_color',
 *     dark: 'secondary_dark_color'
 *   }
 * }
 * ```
 */
export type TValueMapping = string | Record<string, string | Record<string, any>>

/**
 * Callback invoked when Elementor settings change
 * @param options The updated options object
 */
export type TSettingsChangeCallback = (options: Record<string, string>) => Promise<void>

// Additional type aliases for commonly used Elementor types from @arts/elementor-types
// This provides convenient access to standardized Elementor value types

/**
 * Type alias for CSS values from @arts/elementor-types
 * Supports both object notation with size/unit and primitive values
 */
export type TCSSValue = Utils.CSSValue

/**
 * Type alias for responsive CSS values that can have different values per device
 */
export type TResponsiveCSSValue = Utils.ResponsiveCSSValue

/**
 * Type alias for responsive values that can be different per device breakpoint
 */
export type TResponsiveValue<T> = Utils.ResponsiveValue<T>

/**
 * Type alias for dimensions values (padding, margin, etc.)
 */
export type TDimensionsValue = Utils.DimensionsValue

/**
 * Type alias for color values (supports global colors)
 */
export type TColorValue = Utils.ColorValue

/**
 * Type alias for media values (images, videos)
 */
export type TMediaValue = Utils.MediaValue

/**
 * Type alias for icon values
 */
export type TIconValue = Utils.IconValue

/**
 * Type alias for link values
 */
export type TLinkValue = Utils.LinkValue

/**
 * Type alias for typography values
 */
export type TTypographyValue = Utils.TypographyValue

/**
 * Type alias for box shadow values
 */
export type TBoxShadowValue = Utils.BoxShadowValue
