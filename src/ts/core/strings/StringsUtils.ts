/**
 * Normalizes whitespace and validates the result against `document.querySelector` before returning.
 * Returns `""` for empty input or for selectors the browser rejects, preventing later DOM-query throws.
 *
 * @param verbose - When `true`, logs a warning describing why the selector was rejected.
 */
export const sanitizeSelector = (selector: string, verbose = false): string => {
	if (typeof selector !== "string" || selector.trim() === "") {
		if (verbose) {
			console.warn("sanitizeSelector: selector must be a non-empty string");
		}
		return "";
	}

	const normalizedSelector = selector
		.replace(/(\r\n|\n|\r|\t)/gm, " ")
		.replace(/\s+/g, " ")
		.replace(/^[,\s]+|[,\s]+$/g, "")
		.replace(/\s*,\s*/g, ",");

	try {
		// Round-trip through querySelector to confirm the selector is valid CSS.
		document.querySelector(normalizedSelector);

		return normalizedSelector;
	} catch (e) {
		if (verbose) {
			console.warn("sanitizeSelector: Invalid selector", e);
		}
		return "";
	}
};

/**
 * Resolves `url` against `window.location.origin` and strips the trailing slash (except for the root URL).
 */
export const normalizeURL = (url: string): string => {
	const fullUrl = new URL(url, window.location.origin);

	let normalized = fullUrl.href;

	if (normalized.endsWith("/") && normalized !== `${fullUrl.origin}/`) {
		normalized = normalized.slice(0, -1);
	}

	return normalized;
};

/**
 * Splits on spaces, strips a leading `.` from each token (so CSS-selector-style input works),
 * and trims whitespace. Empty/non-string input yields `[]`.
 */
export const parseClassNames = (classInput: string = ""): string[] => {
	if (typeof classInput !== "string" || classInput.trim().length === 0) {
		return [];
	}

	const classes = classInput.split(" ").filter(Boolean);

	return classes.map((className) => {
		className = className.trim();
		return className.startsWith(".") ? className.substring(1) : className;
	});
};

/**
 * Parses `rgb()`, `rgba()`, and 3/6/8-digit hex colors. Returns the color as an `rgb()` string
 * with alpha extracted as a separate `0..1` value. The 8-digit hex case decodes the trailing pair as alpha.
 * Returns `null` for other formats (e.g. `hsl()`, named colors).
 */
export const parseColorString = (
	colorString: string,
): { color: string; alpha: number } | null => {
	if (typeof colorString !== "string" || colorString.trim() === "") {
		return null;
	}

	const rgbRegex = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/;
	const rgbaRegex =
		/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d*\.?\d*)\s*\)$/;
	const hexRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

	let match = colorString.match(rgbRegex);
	if (match) {
		const [, r, g, b] = match;
		const color = `rgb(${r}, ${g}, ${b})`;
		return { color, alpha: 1.0 };
	}

	match = colorString.match(rgbaRegex);
	if (match) {
		const [, r, g, b, a] = match;
		const color = `rgb(${r}, ${g}, ${b})`;
		const alpha = a ? parseFloat(a) : 0;
		return { color, alpha };
	}

	match = colorString.match(hexRegex);
	if (match && match[1]) {
		const hex = match[1];
		let r: number;
		let g: number;
		let b: number;
		let alpha = 1.0;

		if (hex.length === 3) {
			// Shorthand `#rgb` expands by doubling each nibble: `f80` → `ff8800`.
			r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
			g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
			b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
		} else if (hex.length === 6) {
			r = parseInt(hex.substring(0, 2), 16);
			g = parseInt(hex.substring(2, 4), 16);
			b = parseInt(hex.substring(4, 6), 16);
		} else {
			// `#rrggbbaa` — last byte is the alpha channel (0..255), normalize to 0..1.
			r = parseInt(hex.substring(0, 2), 16);
			g = parseInt(hex.substring(2, 4), 16);
			b = parseInt(hex.substring(4, 6), 16);
			alpha = parseInt(hex.substring(6, 8), 16) / 255;
		}

		const color = `rgb(${r}, ${g}, ${b})`;
		return { color, alpha };
	}

	return null;
};
