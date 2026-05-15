/**
 * Callbacks fired for elements observed by `IntersectionObserver`.
 *
 * Note: the `*Debounced` callbacks are NOT debounced internally — they are
 * extra slots invoked synchronously alongside their non-debounced counterparts.
 * Pass a function debounced by the caller if that behavior is required.
 */
export interface IIntersectionCallbacks {
	/** Receives elements whose entries report `isIntersecting === true`. */
	onIntersect?: (
		targets: Array<Element>,
		entries: Array<IntersectionObserverEntry>,
	) => void;

	/** Receives elements whose entries report `isIntersecting === false`. */
	offIntersect?: (
		targets: Array<Element>,
		entries: Array<IntersectionObserverEntry>,
	) => void;

	/** Called immediately after {@link onIntersect}. Wrap with `debounce` to get debouncing. */
	onIntersectDebounced?: (
		targets: Array<Element>,
		entries: Array<IntersectionObserverEntry>,
	) => void;

	/** Called immediately after {@link offIntersect}. Wrap with `debounce` to get debouncing. */
	offIntersectDebounced?: (
		targets: Array<Element>,
		entries: Array<IntersectionObserverEntry>,
	) => void;
}

/**
 * Lifecycle of an `IntersectionObserver` wrapper.
 * Calls to `init()` are idempotent; `destroy()` disconnects the observer and clears the instance so a subsequent `init()` can recreate it.
 */
export interface IIntersection {
	init(): void;
	destroy(): void;
}
