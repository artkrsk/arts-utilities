import type { TElementorSettings, TElementorSettingValue, TElementorSetting } from '../types'

export interface IElementorSettingChangedEvent extends CustomEvent {
  detail: {
    settings: TElementorSettings
    setting: TElementorSetting
    value: TElementorSettingValue
  }
}
