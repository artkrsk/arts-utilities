/**
 * Delays invocation until `wait` milliseconds pass without further calls.
 * Each call within the wait window cancels the previous pending execution.
 */
export interface IDebounce {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	<T extends (...args: any[]) => any>(fn: T, wait: number): T;
}
