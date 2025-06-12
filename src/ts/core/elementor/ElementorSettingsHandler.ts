import type { IElementorSettingChangedEvent } from '../interfaces'
import type { TSettingsChangeCallback } from '../types'
import { getLiveSettings, convertSettings } from '.'

/**
 * Type guard to check if an event is an Elementor setting changed event.
 * Validates the event structure to ensure it contains the required properties.
 *
 * @param event - The CustomEvent to validate
 * @returns True if the event is a valid Elementor setting changed event
 */
function isElementorSettingEvent(event: CustomEvent): event is IElementorSettingChangedEvent {
  return (
    event &&
    event.detail &&
    typeof event.detail === 'object' &&
    'settings' in event.detail &&
    'setting' in event.detail
  )
}

/**
 * Manages real-time setting changes from the Elementor editor to frontend components.
 * This handler bridges the gap between Elementor's editor interface and custom components,
 * allowing for live preview updates without page refreshes.
 *
 * Key features:
 * - Listens for custom Elementor setting change events
 * - Filters relevant settings to avoid unnecessary updates
 * - Converts raw Elementor settings to component-friendly format
 * - Prevents race conditions during rapid setting changes
 * - Provides clean attach/detach lifecycle management
 *
 * @example
 * ```typescript
 * // Example 1: Basic usage with a component
 * const handler = new ElementorSettingsHandler(
 *   (newOptions) => {
 *     // Update component with new settings
 *     myComponent.updateSettings(newOptions);
 *   },
 *   {
 *     // Component configuration mapping
 *     backgroundColor: 'background_color',
 *     fontSize: 'font_size',
 *     animation: { condition: 'enable_animation', value: 'animation_type' }
 *   }
 * );
 *
 * // Start listening for changes
 * handler.attach();
 *
 * // Example 2: Usage in a component lifecycle
 * class MyElementorWidget {
 *   private settingsHandler: ElementorSettingsHandler;
 *
 *   constructor(options) {
 *     this.settingsHandler = new ElementorSettingsHandler(
 *       this.handleSettingsChange.bind(this),
 *       options
 *     );
 *   }
 *
 *   init() {
 *     this.settingsHandler.attach();
 *   }
 *
 *   destroy() {
 *     this.settingsHandler.detach();
 *   }
 *
 *   private handleSettingsChange(newOptions) {
 *     this.updateStyles(newOptions);
 *     this.refreshLayout();
 *   }
 * }
 *
 * // Example 3: Advanced configuration with conditions
 * const advancedHandler = new ElementorSettingsHandler(
 *   updateSlider,
 *   {
 *     autoplay: 'slider_autoplay',
 *     speed: {
 *       condition: 'slider_autoplay',
 *       value: 'autoplay_speed'
 *     },
 *     slides: {
 *       desktop: 'slides_to_show',
 *       tablet: 'slides_to_show_tablet',
 *       mobile: 'slides_to_show_mobile'
 *     }
 *   }
 * );
 * ```
 */
export class ElementorSettingsHandler {
  private options: Record<any, any>
  private callback: TSettingsChangeCallback
  private isChanging = false

  /**
   * Creates a new ElementorSettingsHandler instance.
   *
   * @param callback - Function called when relevant settings change. Receives converted settings object.
   * @param options - Configuration object mapping component options to Elementor setting names.
   *                  Supports simple string mappings, conditional mappings, and nested structures.
   */
  constructor(callback: TSettingsChangeCallback, options: Record<any, any>) {
    this.callback = callback
    this.options = options
  }

  /**
   * Begins listening for Elementor setting change events.
   * Call this method when your component initializes and needs live preview updates.
   *
   * @example
   * ```typescript
   * const handler = new ElementorSettingsHandler(updateCallback, options);
   * handler.attach(); // Start listening for changes
   * ```
   */
  public attach(): void {
    window.addEventListener(
      'arts/elementor_extension/editor/setting_changed',
      this.handleEvent as EventListener
    )
  }

  /**
   * Stops listening for Elementor setting change events and cleans up resources.
   * Always call this method when your component is destroyed to prevent memory leaks.
   *
   * @example
   * ```typescript
   * // In component cleanup/unmount
   * handler.detach(); // Stop listening and cleanup
   * ```
   */
  public detach(): void {
    window.removeEventListener(
      'arts/elementor_extension/editor/setting_changed',
      this.handleEvent as EventListener
    )
  }

  /**
   * Initial event handler that validates and filters incoming events.
   * Only processes events that match the expected Elementor setting change structure.
   */
  private handleEvent = (event: CustomEvent): void => {
    if (!isElementorSettingEvent(event)) {
      return
    }

    this.onChange(event)
  }

  /**
   * Processes validated Elementor setting change events with debouncing.
   * Implements a simple locking mechanism to prevent race conditions during
   * rapid successive setting changes in the editor.
   *
   * @param event - Validated Elementor setting changed event
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
   * Determines if a changed setting is relevant to the current component.
   * Uses the component's configuration to check if the setting key is mapped
   * to any component options.
   *
   * @param setting - The Elementor setting key that changed
   * @returns True if the setting affects this component and should trigger an update
   */
  private isRelevantSetting(setting: string): boolean {
    const liveSettings = getLiveSettings(this.options)
    return liveSettings.includes(setting)
  }

  /**
   * Converts raw Elementor settings to component format and triggers the callback.
   * Handles the complex mapping from Elementor's flat setting structure to
   * the component's expected configuration format.
   *
   * @param settings - Raw Elementor settings object from the editor
   */
  private async applySettingsChange(settings: Record<string, any>): Promise<void> {
    const options = convertSettings(settings, this.options)
    await this.callback(options)
  }
}
