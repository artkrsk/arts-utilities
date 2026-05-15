/**
 * Browser/viewport probes that swallow exceptions and degrade to safe defaults
 * (`false` or `0`) so callers can use them in environments where `window` access may throw.
 */
export interface IBrowserService {
	/** Returns `false` for malformed queries rather than throwing. */
	matchMedia: (query: string) => boolean;

	/** Maximum of `documentElement.clientWidth` and `window.innerWidth`. Returns `0` on failure. */
	getViewportWidth: () => number;

	/** Maximum of `documentElement.clientHeight` and `window.innerHeight`. Returns `0` on failure. */
	getViewportHeight: () => number;

	/**
	 * Returns `true` when `window.self !== window.top`.
	 * Also returns `true` when reading `window.top` throws (cross-origin frame).
	 */
	isInIframe: () => boolean;
}
