/**
 * Options for `elementIsVisibleInViewport`.
 */
export interface IElementVisibilityOptions {
	/**
	 * When `true`, the element counts when a top or bottom edge and a left or right edge lie inside the viewport; an element spanning past both viewport edges on an axis does not. When `false`, the element must be entirely within the viewport.
	 *
	 * @default true
	 */
	partiallyVisible?: boolean;

	/**
	 * Pixels added to each viewport edge before the comparison. Positive values expand the hit area; negative values shrink it.
	 *
	 * @default 0
	 */
	tolerance?: number;
}

/**
 * Options for `isElementFullscreen`.
 */
export interface IFullscreenRectOptions {
	/**
	 * When `true`, dimensions and offsets are rounded to integers before being compared,
	 * which avoids false negatives from sub-pixel layout.
	 *
	 * @default true
	 */
	shouldRound?: boolean;

	/**
	 * Pixel slack permitted on each compared edge (width, height, top, left).
	 *
	 * @default 2
	 */
	tolerance?: number;
}
