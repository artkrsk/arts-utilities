// Define types for Elementor settings and mappings
export type TElementorSettings = Record<string, any>
export type TElementorSettingValue = string | number | boolean
export type TElementorSetting = string
export type TMappingValue = Record<string, any> & {
  value?: string | Record<string, any>
  return_size?: boolean
  condition?: string
}
export type TSettingsMap = Record<string, string | TMappingValue>
export type TValueMapping = string | Record<string, string | Record<string, any>>
