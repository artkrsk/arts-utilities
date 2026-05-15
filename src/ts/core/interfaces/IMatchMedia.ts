/**
 * Media query listener with explicit `destroy()` for cleanup.
 */
export interface IMatchMedia {
	destroy(): void;
}

/**
 * Callbacks fired when a media query's match state changes.
 */
export interface IMatchMediaCallbacks {
	/** Invoked when the query starts matching. */
	match?: () => void;
	/** Invoked when the query stops matching. */
	noMatch?: () => void;
}
