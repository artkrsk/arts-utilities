import type { IElementorSettingChangedEvent } from "../interfaces";
import type { TSettingsChangeCallback } from "../types";
import { convertSettings, getLiveSettings } from ".";

function isElementorSettingEvent(
	event: CustomEvent,
): event is IElementorSettingChangedEvent {
	return (
		event &&
		event.detail &&
		typeof event.detail === "object" &&
		"settings" in event.detail &&
		"setting" in event.detail
	);
}

/**
 * Listens for `arts/elementor_extension/editor/setting_changed` events and invokes `callback`
 * with the converted settings whenever a change affects the mapped keys. A re-entrancy guard
 * drops events that arrive while a previous callback is still resolving.
 */
export class ElementorSettingsHandler {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private options: Record<any, any>;
	private callback: TSettingsChangeCallback;
	private isChanging = false;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(callback: TSettingsChangeCallback, options: Record<any, any>) {
		this.callback = callback;
		this.options = options;
	}

	public attach(): void {
		window.addEventListener(
			"arts/elementor_extension/editor/setting_changed",
			this.handleEvent as EventListener,
		);
	}

	public detach(): void {
		window.removeEventListener(
			"arts/elementor_extension/editor/setting_changed",
			this.handleEvent as EventListener,
		);
	}

	private handleEvent = (event: CustomEvent): void => {
		if (!isElementorSettingEvent(event)) {
			return;
		}

		this.onChange(event);
	};

	private onChange = async (
		event: IElementorSettingChangedEvent,
	): Promise<void> => {
		// Drop events that arrive while the previous callback is still in flight — prevents
		// concurrent callbacks from racing against each other during rapid editor input.
		if (this.isChanging) {
			return;
		}

		this.isChanging = true;

		try {
			const { settings, setting } = event.detail;

			if (!this.isRelevantSetting(setting)) {
				return;
			}

			await this.applySettingsChange(settings);
		} finally {
			this.isChanging = false;
		}
	};

	private isRelevantSetting(setting: string): boolean {
		const liveSettings = getLiveSettings(this.options);
		return liveSettings.includes(setting);
	}

	private async applySettingsChange(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		settings: Record<string, any>,
	): Promise<void> {
		const options = convertSettings(settings, this.options);
		await this.callback(options);
	}
}
