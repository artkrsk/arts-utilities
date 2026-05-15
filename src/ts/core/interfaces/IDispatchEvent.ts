/**
 * Configuration for {@link IDispatchEvent}.
 */
export interface IDispatchEventOptions<T = unknown> {
	/** Becomes `event.detail`. Omitted from the CustomEventInit when undefined. */
	detail?: T;

	/** @default true */
	bubbles?: boolean;

	/** @default true */
	cancelable?: boolean;

	/** @default false */
	composed?: boolean;
}

/**
 * Creates and dispatches a `CustomEvent`. Returns `false` and never throws when:
 * - `window` or `window.CustomEvent` is unavailable
 * - The resolved target is falsy
 * - `dispatchEvent` itself throws
 */
export interface IDispatchEvent {
	/**
	 * @param target - Receives the event. Defaults to `document`.
	 * @returns The result of `target.dispatchEvent`, or `false` on the failure paths described above.
	 */
	<T = unknown>(
		eventName: string,
		options?: IDispatchEventOptions<T>,
		target?: EventTarget | null,
	): boolean;
}
