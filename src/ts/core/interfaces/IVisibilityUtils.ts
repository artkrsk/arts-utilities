/**
 * Options for `elementIsVisibleInViewport`.
 */
export interface IElementVisibilityOptions {
	/**
	 * When `true`, any overlap with the viewport counts. When `false`, the element must be entirely within the viewport.
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
