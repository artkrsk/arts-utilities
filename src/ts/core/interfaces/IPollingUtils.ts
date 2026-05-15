/**
 * Configuration for {@link IPollingUtils.waitForVariable}.
 */
export interface IWaitForVariableOptions {
	/**
	 * Milliseconds between existence checks.
	 *
	 * @default 20
	 */
	checkingInterval?: number;

	/**
	 * Milliseconds after which the returned promise rejects.
	 *
	 * @default 10000
	 */
	timeout?: number;
}

/**
 * Polling helpers for waiting on globals injected by third-party scripts.
 */
export interface IPollingUtils {
	/**
	 * Resolves with `window[variable]` once it becomes defined.
	 * Rejects with an `Error` whose message includes the variable name and timeout when the timeout elapses first.
	 * Resolves synchronously (on the next microtask) when the variable is already defined at call time.
	 */
	waitForVariable: (
		variable: string,
		options?: IWaitForVariableOptions,
	) => Promise<unknown>;
}
