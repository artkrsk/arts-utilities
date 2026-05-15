/**
 * Lifecycle of a `ResizeObserver` wrapper.
 * `init()` is idempotent; `destroy()` disconnects the observer and clears the instance so a subsequent `init()` can recreate it.
 */
export interface IResize {
	init(): void;
	destroy(): void;
}

/**
 * Callbacks fired for elements observed by `ResizeObserver`.
 *
 * Note: `onResizeDebounced` is NOT debounced internally — it is an extra slot
 * invoked synchronously after `onResize`. Pass a function debounced by the caller if that behavior is required.
 */
export interface IResizeCallbacks {
	onResize?: (
		targets: Array<Element>,
		entries: Array<ResizeObserverEntry>,
	) => void;

	/** Called immediately after {@link onResize}. Wrap with `debounce` to get debouncing. */
	onResizeDebounced?: (
		targets: Array<Element>,
		entries: Array<ResizeObserverEntry>,
	) => void;
}
