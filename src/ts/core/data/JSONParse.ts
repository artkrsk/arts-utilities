import type { IJSONParse } from "../interfaces";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const JSONParse: IJSONParse = (strObj: string): Record<string, any> => {
	if (!strObj || typeof strObj !== "string") {
		return {};
	}

	try {
		return JSON.parse(strObj);
	} catch (error) {
		// Strict parser rejected the input — retry after rewriting to canonical JSON.
		try {
			return JSON.parse(convertToStandardJSON(strObj));
		} catch (innerError) {
			return {};
		}
	}
};

/**
 * Rewrites relaxed JSON (unquoted keys, single quotes, etc.) into canonical form so `JSON.parse` accepts it.
 */
export function convertToStandardJSON(strObj: string): string {
	if (!strObj) {
		return "{}";
	}

	let filteredStr = strObj;

	filteredStr = filteredStr.replace(/'/g, '"');

	// Quote bare property names that follow `{` or `,`.
	filteredStr = filteredStr.replace(
		/(?<=\{|,)(\s*)([a-zA-Z0-9_$]+)(\s*):/g,
		'$1"$2"$3:',
	);

	// Insert a comma between adjacent object/array boundaries that lost theirs.
	filteredStr = filteredStr
		.replace(/}"/g, '},"')
		.replace(/]"/g, '],"')
		.replace(/}'/g, "},")
		.replace(/]'/g, "],");

	return filteredStr;
}
