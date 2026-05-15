import type {
	IDataAttribute,
	IDataAttributeOptions,
	IFilterDataAttributes,
	IParseAttribute,
	IParseDataAttributes,
} from "../interfaces";

export const parseAttribute: IParseAttribute = (
	attr: IDataAttribute,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	result: Record<string, any>,
	separator: string,
): void => {
	// Drop the `data-` prefix (5 chars) before splitting into path segments.
	const path = attr.name.slice(5).split(separator);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	path.reduce(
		(
			obj: Record<string, any>,
			part: string,
			idx: number,
			fullPath: string[],
		) => {
			// Defensive: if a separator pattern somehow leaves `data` in the path, skip it.
			if (part === "data") {
				return obj;
			}

			if (idx === fullPath.length - 1) {
				obj[part] = attr.value;
			} else {
				obj[part] = obj[part] && typeof obj[part] === "object" ? obj[part] : {};
			}

			return obj[part];
		},
		result,
	);
};

export const filterDataAttributes: IFilterDataAttributes = (
	attr: IDataAttribute,
	pattern: RegExp,
): boolean => {
	const isDataAttribute = /^data-/.test(attr.name);

	if (!pattern) {
		return isDataAttribute;
	}

	// Test the pattern against the attribute name without the 'data-' prefix.
	return isDataAttribute && pattern.test(attr.name.slice(5));
};

export const parseDataAttributes: IParseDataAttributes = (
	element: HTMLElement,
	options: IDataAttributeOptions = {},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const result: Record<string, any> = {};

	const separator = options.separator ?? "-";
	const pattern = options.pattern ?? /^/;

	Array.prototype.slice
		.call(element.attributes)
		.filter((attr: IDataAttribute) => filterDataAttributes(attr, pattern))
		.forEach((attr: IDataAttribute) => parseAttribute(attr, result, separator));

	return result;
};
