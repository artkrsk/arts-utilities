import type { Utils } from "@artemsemkin/elementor-types";

/** Flat settings dictionary used by Elementor widgets. Aliased from `@artemsemkin/elementor-types`. */
export type TElementorSettings = Utils.ElementSettings;

/**
 * A single setting's value. Loosely typed because Elementor stores primitives,
 * dimension objects, responsive maps, and arbitrary repeater rows under the same shape.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TElementorSettingValue = any;

/** A setting key (the string used to look up a value in {@link TElementorSettings}). */
export type TElementorSetting = string;

/**
 * Object form of a mapping value used in {@link TSettingsMap}.
 *
 * - `value` — source setting key (string) or nested mapping (object).
 * - `return_size` — when `true` and the looked-up value is a `{ size, unit }` dimension, only the `size` is returned.
 * - `condition` — name of a setting that must be truthy for this entry to apply; otherwise `convertSettings` writes `false`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TMappingValue = Record<string, any> & {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value?: string | Record<string, any>;
	return_size?: boolean;
	condition?: string;
};

/**
 * Maps output keys to either a source setting name (string) or a {@link TMappingValue}.
 * Drives `convertSettings` — see its docstring for the supported mapping shapes.
 */
export type TSettingsMap = Record<string, string | TMappingValue>;

/**
 * Argument form accepted by `processComplexValue`. Either a source key (string)
 * or a nested mapping object whose leaves are source keys or further nested objects.
 */
export type TValueMapping =
	| string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	| Record<string, string | Record<string, any>>;

/** Async callback invoked by `ElementorSettingsHandler` after a relevant setting changes. */
export type TSettingsChangeCallback = (
	options: Record<string, string>,
) => Promise<void>;

// Re-exports of Utils.* from @artemsemkin/elementor-types under the project's `T`-prefixed naming convention.

export type TCSSValue = Utils.CSSValue;

export type TResponsiveCSSValue = Utils.ResponsiveCSSValue;

export type TResponsiveValue<T> = Utils.ResponsiveValue<T>;

export type TDimensionsValue = Utils.DimensionsValue;

export type TColorValue = Utils.ColorValue;

export type TMediaValue = Utils.MediaValue;

export type TIconValue = Utils.IconValue;

export type TLinkValue = Utils.LinkValue;

export type TTypographyValue = Utils.TypographyValue;

export type TBoxShadowValue = Utils.BoxShadowValue;
