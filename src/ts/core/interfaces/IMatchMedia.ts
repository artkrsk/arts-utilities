/**
 * Media query listener with explicit `destroy()` for cleanup.
 */
export interface IMatchMedia {
	destroy(): void;
}

/**
 * Callbacks fired when a media query's match state changes, and once on init for its current state.
 */
export interface IMatchMediaCallbacks {
	/** Invoked when the query starts matching, or already matches on init. */
	match?: () => void;
	/** Invoked when the query stops matching, or does not match on init. */
	noMatch?: () => void;
}
