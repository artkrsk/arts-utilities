/**
 * Configuration for {@link IPageLock}.
 */
export interface IPageLockOptions {
	/**
	 * Forwarded to `addEventListener` for the registered `wheel`, `touchmove`, and `keydown` handlers.
	 * Passive listeners cannot call `preventDefault()`, so the lock will be ineffective when `true`.
	 *
	 * @default false
	 */
	passive?: boolean;

	/**
	 * When `true`, blocks Space, Page Up/Down, Home, End, and arrow keys outside of input/textarea/contenteditable targets.
	 *
	 * @default true
	 */
	lockKeyboard?: boolean;

	/**
	 * When `true`, wheel and touchmove events that originate inside a scrollable ancestor
	 * pass through if that ancestor has remaining scroll room in the gesture's direction.
	 * Otherwise every scroll event is blocked.
	 *
	 * @default false
	 */
	allowNestedScroll?: boolean;
}

/**
 * Locks page scrolling and (optionally) keyboard navigation by attaching window-level event listeners.
 * Calling with `false` removes every listener it could have registered, so it is safe to call unlock
 * even when the active options differ from the original lock call.
 */
export interface IPageLock {
	/**
	 * @param lock - `true` to attach the locking listeners, `false` to remove them. Defaults to `true`.
	 */
	(lock?: boolean, options?: IPageLockOptions): void;
}

/**
 * Calls `event.preventDefault()` and `event.stopPropagation()`.
 * If `stopPropagation()` throws, the error is captured, `preventDefault()` still runs, and the error is re-thrown.
 */
export interface IPreventDefault {
	(event: { preventDefault(): void; stopPropagation(): void }): void;
}

/**
 * Calls `event.preventDefault()` for Space, Page Up/Down, Home, End, and arrow keys
 * unless the event originated from a text-entry target (input of text-like type, textarea, or contenteditable).
 * Reads both `event.key` and the legacy `event.keyCode` for older browser support.
 */
export interface IPreventKeyboard {
	(event: KeyboardEvent): void;
}
