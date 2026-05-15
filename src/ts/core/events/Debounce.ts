import type { IDebounce } from "../interfaces";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce: IDebounce = <T extends (...args: any[]) => any>(
	fn: T,
	wait: number,
): T => {
	let timeout: number | undefined;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const debounced = function (this: any, ...args: any[]) {
		clearTimeout(timeout);
		timeout = window.setTimeout(() => fn.apply(this, args), wait);
	} as unknown as T;

	return debounced;
};
