import type {
	TElementorSetting,
	TElementorSettings,
	TElementorSettingValue,
} from "../types";

/**
 * `CustomEvent` payload dispatched when an Elementor setting changes,
 * carrying both the specific key/value pair and the full settings snapshot at that moment.
 */
export interface IElementorSettingChangedEvent extends CustomEvent {
	detail: {
		/** Snapshot of all current settings on the element when the event fired. */
		settings: TElementorSettings;
		/** Key of the setting that changed. */
		setting: TElementorSetting;
		/** New value assigned to `setting`. */
		value: TElementorSettingValue;
	};
}
