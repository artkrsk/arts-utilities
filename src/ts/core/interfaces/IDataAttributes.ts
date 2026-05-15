/**
 * Options for {@link IParseDataAttributes}.
 */
export interface IDataAttributeOptions {
	/**
	 * Splits each attribute name (with `data-` stripped) into a nested path.
	 *
	 * @default "-"
	 *
	 * @example
	 * // separator "-": data-config-api-timeout → { config: { api: { timeout: value } } }
	 * // separator "__": data-config__api → { config: { api: value } }
	 */
	separator?: string;

	/**
	 * Tested against each attribute name with the `data-` prefix removed.
	 *
	 * @default /^/
	 */
	pattern?: RegExp;
}

/**
 * Plain attribute shape (`name`, `value`) used by the helpers below.
 */
export interface IDataAttribute {
	name: string;
	value: string;
}

/**
 * Returns a nested object built from the element's `data-*` attributes.
 * Each attribute name (with `data-` removed) is split by `options.separator` and the value placed at the resulting path.
 */
export interface IParseDataAttributes {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(element: HTMLElement, options?: IDataAttributeOptions): Record<string, any>;
}

/**
 * Writes one attribute into `result` at the path produced by splitting `attr.name` (after the `data-` prefix) by `separator`.
 */
export interface IParseAttribute {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(attr: IDataAttribute, result: Record<string, any>, separator: string): void;
}

/**
 * Returns `true` when `attr.name` starts with `data-` and the remainder matches `pattern`.
 * If `pattern` is falsy, only the `data-` prefix check is applied.
 */
export type IFilterDataAttributes = (
	attr: IDataAttribute,
	pattern: RegExp,
) => boolean;
