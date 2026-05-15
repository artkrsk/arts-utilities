export type TResponsiveResizeCallback = () => void;

/**
 * Options for {@link IResponsiveResize}.
 */
export interface IResponsiveResizeOptions {
	callback: TResponsiveResizeCallback;

	/**
	 * Run `callback` once during attachment so consumers can establish initial state without duplicating it.
	 *
	 * @default true
	 */
	immediateCall?: boolean;
}

/**
 * Returned by {@link IResponsiveResize}. Removes every listener the call attached.
 */
export interface IResponsiveResizeCleanup {
	clear: () => void;
}

/**
 * Subscribes `callback` to viewport changes with a touch-device guard:
 *
 * - Width changes are tracked unconditionally via `window.resize`.
 * - Height changes are tracked via `window.resize` only while `(hover: hover) and (pointer: fine)` matches.
 *   This skips spurious mobile callbacks caused by the soft keyboard.
 * - The pointer-type listener swaps the height listener in/out when the device's hover/pointer capabilities change.
 *
 * `callback` only fires when the relevant dimension actually changes from the last seen value.
 */
export interface IResponsiveResize {
	(
		callback: TResponsiveResizeCallback,
		immediateCall?: boolean,
	): IResponsiveResizeCleanup;
}
