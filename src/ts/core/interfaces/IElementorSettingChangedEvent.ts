import type { TElementorSettings, TElementorSettingValue, TElementorSetting } from '../types'

/**
 * Custom event interface for Elementor setting change notifications.
 * Extends the standard CustomEvent to provide structured data about setting changes
 * in Elementor components, enabling reactive programming patterns for real-time updates.
 *
 * This event is typically dispatched when Elementor settings are modified through
 * the editor interface or programmatically, allowing components to respond to
 * configuration changes immediately.
 *
 * @example
 * ```typescript
 * // Listen for Elementor setting changes
 * document.addEventListener('elementor-setting-changed', (event: IElementorSettingChangedEvent) => {
 *   const { settings, setting, value } = event.detail;
 *
 *   // Handle specific setting changes
 *   switch (setting) {
 *     case 'background_color':
 *       updateBackgroundColor(value as string);
 *       break;
 *     case 'animation_duration':
 *       updateAnimationDuration(value as number);
 *       break;
 *     case 'responsive_breakpoints':
 *       updateResponsiveLayout(settings);
 *       break;
 *   }
 * });
 *
 * // Dispatch setting change event
 * const settingChangeEvent: IElementorSettingChangedEvent = new CustomEvent('elementor-setting-changed', {
 *   detail: {
 *     settings: currentSettings,
 *     setting: 'text_color',
 *     value: '#ff0000'
 *   }
 * }) as IElementorSettingChangedEvent;
 *
 * document.dispatchEvent(settingChangeEvent);
 * ```
 *
 * @example
 * ```typescript
 * // React component responding to Elementor changes
 * useEffect(() => {
 *   const handleSettingChange = (event: IElementorSettingChangedEvent) => {
 *     const { setting, value, settings } = event.detail;
 *
 *     // Update component state based on Elementor setting
 *     if (setting === 'widget_layout') {
 *       setLayout(value as 'grid' | 'list');
 *     }
 *
 *     // Sync entire settings object
 *     setElementorSettings(settings);
 *   };
 *
 *   document.addEventListener('elementor-setting-changed', handleSettingChange);
 *
 *   return () => {
 *     document.removeEventListener('elementor-setting-changed', handleSettingChange);
 *   };
 * }, []);
 * ```
 */
export interface IElementorSettingChangedEvent extends CustomEvent {
  /**
   * Event detail containing comprehensive information about the setting change.
   * Provides both the specific setting that changed and the complete settings context.
   */
  detail: {
    /**
     * Complete Elementor settings object containing all current setting values.
     * Useful for components that need access to multiple related settings or
     * need to maintain a complete picture of the component's configuration.
     *
     * @example
     * ```typescript
     * // Access all typography settings
     * const { settings } = event.detail;
     * const typography = {
     *   fontFamily: settings.font_family,
     *   fontSize: settings.font_size,
     *   fontWeight: settings.font_weight,
     *   lineHeight: settings.line_height
     * };
     * updateTypography(typography);
     * ```
     */
    settings: TElementorSettings

    /**
     * The specific setting key that was modified.
     * Allows listeners to handle only relevant setting changes and ignore others.
     *
     * @example
     * ```typescript
     * const { setting, value } = event.detail;
     *
     * // Handle only color-related settings
     * if (setting.includes('color')) {
     *   updateColorScheme(setting, value as string);
     * }
     *
     * // Handle responsive settings
     * if (setting.startsWith('responsive_')) {
     *   updateResponsiveProperty(setting, value);
     * }
     * ```
     */
    setting: TElementorSetting

    /**
     * The new value assigned to the changed setting.
     * Can be any valid Elementor setting value (string, number, boolean, object, array).
     *
     * @example
     * ```typescript
     * const { setting, value } = event.detail;
     *
     * switch (setting) {
     *   case 'opacity':
     *     // value is number (0-1)
     *     element.style.opacity = (value as number).toString();
     *     break;
     *   case 'background_image':
     *     // value is object with url and alt
     *     const bgImage = value as { url: string; alt: string };
     *     element.style.backgroundImage = `url(${bgImage.url})`;
     *     break;
     *   case 'animations':
     *     // value is array of animation objects
     *     const animations = value as Array<{ type: string; duration: number }>;
     *     applyAnimations(animations);
     *     break;
     * }
     * ```
     */
    value: TElementorSettingValue
  }
}
