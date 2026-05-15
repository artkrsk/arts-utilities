import type {
	IElementVisibilityOptions,
	IFullscreenRectOptions,
} from "../interfaces";

/**
 * Returns `undefined` when `element` is null so callers can distinguish "not provided"
 * from a definitive `false`. Uses `getBoundingClientRect` against `window.inner{Width,Height}`.
 */
export const elementIsVisibleInViewport = (
	element: Element | null,
	options: IElementVisibilityOptions = {},
): boolean | undefined => {
	if (!element) {
		return undefined;
	}

	const { partiallyVisible = true, tolerance = 0 } = options;
	const { top, left, bottom, right } = element.getBoundingClientRect();
	const { innerWidth, innerHeight } = window;

	return partiallyVisible
		? ((top > -tolerance && top <= innerHeight + tolerance) ||
				(bottom > -tolerance && bottom <= innerHeight + tolerance)) &&
				((left > -tolerance && left <= innerWidth + tolerance) ||
					(right > -tolerance && right <= innerWidth + tolerance))
		: top >= -tolerance &&
				left >= -tolerance &&
				bottom <= innerHeight + tolerance &&
				right <= innerWidth + tolerance;
};

/**
 * CSS-level visibility check. Returns false for `visibility: hidden` or `opacity: 0`.
 * Does NOT consider `display: none` (zero-sized elements still report `visibility: visible`).
 */
export const elementIsVisible = (element: Element | null): boolean => {
	if (!element) {
		return false;
	}

	const computedStyle = window.getComputedStyle(element);
	const visibility = computedStyle.getPropertyValue("visibility");
	const opacity = parseFloat(computedStyle.getPropertyValue("opacity"));

	return visibility === "visible" && opacity > 0;
};

export const isElementFullscreen = (
	element: Element | null,
	options: IFullscreenRectOptions = {},
): boolean => {
	if (!element) {
		return false;
	}

	const rect = element.getBoundingClientRect();
	const { shouldRound = true, tolerance = 2 } = options;

	const width = shouldRound ? Math.round(rect.width) : rect.width;
	const height = shouldRound ? Math.round(rect.height) : rect.height;
	const top = shouldRound ? Math.round(rect.top) : rect.top;
	const left = shouldRound ? Math.round(rect.left) : rect.left;

	const isWidthMatch = Math.abs(width - window.innerWidth) <= tolerance;
	const isHeightMatch = Math.abs(height - window.innerHeight) <= tolerance;
	const isTopMatch = Math.abs(top) <= tolerance;
	const isLeftMatch = Math.abs(left) <= tolerance;

	return isWidthMatch && isHeightMatch && isTopMatch && isLeftMatch;
};
