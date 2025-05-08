import type { IElementorSettingChangedEvent } from '../interfaces'
import { getLiveSettings, convertSettings } from '.'
import type { TSettingsChangeCallback } from '../types'

/**
 * Type guard to check if an event is an Elementor setting changed event
 * @param event The event to check
 */
function isElementorSettingEvent(event: Event): event is IElementorSettingChangedEvent {
  return (
    event instanceof CustomEvent &&
    'detail' in event &&
    event.detail &&
    typeof event.detail === 'object' &&
    'settings' in event.detail &&
    'setting' in event.detail
  )
}

/**
 * Handles dynamic setting changes from Elementor editor
 */
export class ElementorSettingsHandler {
  private options: Record<any, any>
  private callback: TSettingsChangeCallback
  private isChanging = false

  /**
   * Creates a settings handler instance
   * @param callback Function to call when settings change
   */
  constructor(callback: TSettingsChangeCallback, options: Record<any, any>) {
    this.callback = callback
    this.options = options
  }

  /**
   * Attach event listener for Elementor setting changes
   */
  public attach(): void {
    window.addEventListener('arts/elementor_extension/editor/setting_changed', this.handleEvent)
  }

  /**
   * Detach event listener
   */
  public detach(): void {
    window.removeEventListener('arts/elementor_extension/editor/setting_changed', this.handleEvent)
  }

  /**
   * Initial event handler that checks and processes the event
   */
  private handleEvent = (event: Event): void => {
    if (!isElementorSettingEvent(event)) {
      return
    }

    this.onChange(event)
  }

  /**
   * Handle Elementor setting change events
   * @param event Custom event from Elementor editor
   */
  private onChange = async (event: IElementorSettingChangedEvent): Promise<void> => {
    if (this.isChanging) {
      return
    }

    this.isChanging = true

    try {
      const { settings, setting } = event.detail

      if (!this.isRelevantSetting(setting)) {
        return
      }

      await this.applySettingsChange(settings)
    } finally {
      this.isChanging = false
    }
  }

  /**
   * Check if the changed setting is relevant to our component
   * @param setting The setting key that changed
   * @returns True if the setting is relevant and should trigger an update
   */
  private isRelevantSetting(setting: string): boolean {
    const liveSettings = getLiveSettings(this.options)
    return liveSettings.includes(setting)
  }

  /**
   * Apply the settings change by converting and calling the callback
   * @param settings The raw Elementor settings object
   */
  private async applySettingsChange(settings: Record<string, any>): Promise<void> {
    const options = convertSettings(settings, this.options)
    await this.callback(options)
  }
}
