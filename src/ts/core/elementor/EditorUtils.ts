import type { ElementorEditor, ElementorFrontend } from "@arts/elementor-types";
import type {
	TElementorSettings,
	TSettingsMap,
	TValueMapping,
} from "../types/TEditorUtils";

interface ElementorWindow extends Window {
	elementorFrontend?: ElementorFrontend;
	elementor?: ElementorEditor;
}

const getElementorWindow = (): ElementorWindow => window as ElementorWindow;

function isCSSValue(value: unknown): value is { size: number; unit: string } {
	return (
		!!value &&
		typeof value === "object" &&
		"size" in value &&
		"unit" in value &&
		typeof value.size === "number" &&
		typeof value.unit === "string"
	);
}

/**
 * Walks an arbitrary mapping value and collects every Elementor setting key it references.
 * Recognizes `condition` and `value` properties used by `convertSettings`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractFromObject(obj: any, keys: string[]): void {
	if (typeof obj === "string") {
		keys.push(obj);
	} else if (typeof obj === "object" && obj !== null) {
		if ("condition" in obj) {
			keys.push(obj["condition"]);
		}

		if ("value" in obj) {
			if (typeof obj["value"] === "string") {
				keys.push(obj["value"]);
			} else if (typeof obj["value"] === "object") {
				extractFromObject(obj["value"], keys);
			}
		} else {
			// No explicit `value` — treat as nested mapping and recurse into each child.
			Object.values(obj).forEach((val) => extractFromObject(val, keys));
		}
	}
}

/**
 * Resolves a {@link TValueMapping} against a raw settings object.
 *
 * - String mapping → direct setting lookup.
 * - Object with `value`:
 *   - When the looked-up value matches `{ size, unit }` (Elementor dimension),
 *     returns `size` by default, or `` `${size}${unit}` `` when `return_size === false`.
 *   - Otherwise returns the raw value.
 * - Object without `value` → recurses, building a nested object whose keys mirror the mapping.
 */
export const processComplexValue = (
	valueMapping: TValueMapping,
	settings: TElementorSettings,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
	if (typeof valueMapping === "string") {
		return settings[valueMapping];
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const result: Record<string, any> = {};

	Object.entries(valueMapping).forEach(([key, mapping]) => {
		if (typeof mapping === "string") {
			result[key] = settings[mapping];
		} else if (typeof mapping === "object") {
			if ("value" in mapping) {
				const value = settings[mapping["value"] as string];

				if (mapping["return_size"] === false) {
					if (isCSSValue(value)) {
						result[key] = `${value.size}${value.unit}`;
					} else {
						result[key] = value;
					}
				} else if (isCSSValue(value)) {
					result[key] = value.size;
				} else {
					result[key] = value;
				}
			} else {
				result[key] = processComplexValue(mapping, settings);
			}
		}
	});

	return result;
};

/**
 * Transforms Elementor's flat settings dictionary into a component-shaped object using `settingsMap`.
 *
 * Mapping rules per key:
 * - `string` — direct lookup; skipped when the setting is `undefined`.
 * - `{ condition: <key> }` — when the referenced setting is falsy, the output key is set to `false` and processing stops.
 * - `{ value: <key>, return_size?: true }` — looks up the value; if `return_size === true` and the value is a `{ size, unit }`
 *   dimension, only the `size` number is written.
 * - `{ value: <TValueMapping object> }` — delegated to `processComplexValue`.
 * - object without `value` — treated as a nested `TSettingsMap` and recursed.
 */
export const convertSettings = (
	settings: TElementorSettings,
	settingsMap: TSettingsMap,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const result: Record<string, any> = {};

	Object.entries(settingsMap).forEach(([jsKey, elementorMapping]) => {
		if (typeof elementorMapping === "string") {
			if (settings[elementorMapping] !== undefined) {
				result[jsKey] = settings[elementorMapping];
			}
		} else if (
			typeof elementorMapping === "object" &&
			elementorMapping !== null
		) {
			if (
				"condition" in elementorMapping &&
				typeof elementorMapping.condition === "string"
			) {
				if (!settings[elementorMapping.condition]) {
					result[jsKey] = false;
					return;
				}
			}

			if ("value" in elementorMapping) {
				const valueProperty = elementorMapping.value;

				if (typeof valueProperty === "string") {
					const settingValue = settings[valueProperty];
					if (
						elementorMapping.return_size === true &&
						isCSSValue(settingValue)
					) {
						result[jsKey] = settingValue.size;
					} else {
						result[jsKey] = settingValue;
					}
				} else if (
					typeof valueProperty === "object" &&
					valueProperty !== null
				) {
					result[jsKey] = processComplexValue(
						valueProperty as TValueMapping,
						settings,
					);
				}
				// `value` of any other type (null, number, boolean) is ignored — output key stays unset.
			} else {
				// No `value` key — the object is itself a nested TSettingsMap.
				result[jsKey] = convertSettings(
					settings,
					elementorMapping as TSettingsMap,
				);
			}
		}
	});

	return result;
};

/**
 * Returns the deduplicated list of Elementor setting keys that influence the given map,
 * plus any extras the caller wants to track. Used by `ElementorSettingsHandler` to decide
 * which editor change events are relevant.
 */
export const getLiveSettings = (
	settingsMap: TSettingsMap = {},
	additionalSettings: string[] = [],
): string[] => {
	const keys: string[] = [];

	Object.values(settingsMap).forEach((mapping) =>
		extractFromObject(mapping, keys),
	);

	return [...new Set([...keys, ...additionalSettings])];
};

// Cached across calls so concurrent callers share a single pending wait rather than each attaching their own listener.
let elementorInitPromise: Promise<boolean> | null = null;

/**
 * Resolves with the current edit-mode flag once `elementorFrontend.elementsHandler` is available
 * (either already, or after the `elementor/frontend/init` event). Resolves with `false` outside of a browser.
 */
export const elementorEditorLoaded = async (): Promise<boolean> => {
	if (
		typeof window !== "undefined" &&
		getElementorWindow().elementorFrontend?.elementsHandler
	) {
		return getElementorWindow().elementorFrontend?.isEditMode() ?? false;
	}

	if (typeof window === "undefined") {
		return false;
	}

	if (elementorInitPromise) {
		return elementorInitPromise;
	}

	elementorInitPromise = new Promise<boolean>((resolve) => {
		window.addEventListener("elementor/frontend/init", () => {
			elementorInitPromise = null;
			if (getElementorWindow().elementorFrontend?.elementsHandler) {
				resolve(getElementorWindow().elementorFrontend?.isEditMode() ?? false);
			} else {
				resolve(false);
			}
		});
	});

	return elementorInitPromise;
};
