import type { LogLevel } from "../constants";

/**
 * Logger runtime configuration.
 */
export interface ILoggerConfig {
	/** When false, every log call becomes a no-op. */
	enabled: boolean;

	/**
	 * Verbosity ceiling. A call is logged only when its level is numerically `<=` this value.
	 * Given `ERROR=0, WARN=1, INFO=2, DEBUG=3`, setting `WARN` lets `error` and `warn` through and filters `info` and `debug`.
	 */
	level: LogLevel;

	/**
	 * Prefix prepended to every formatted message.
	 * Output format is `` `${prefix} [LEVEL] ${message}` ``, with a leading space when the prefix is empty.
	 */
	prefix?: string;
}

/**
 * Structured logger with severity gating and scope chaining.
 */
export interface ILogger {
	/** Merges the partial config over the current one. Unspecified keys are preserved. */
	configure(config: Partial<ILoggerConfig>): void;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	error(message: string, ...args: any[]): void;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	warn(message: string, ...args: any[]): void;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	info(message: string, ...args: any[]): void;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	debug(message: string, ...args: any[]): void;

	/**
	 * Returns a new logger whose prefix is the current prefix with `:${scope}` appended.
	 * Repeated scoping chains: `logger.scope('a').scope('b')` produces prefix `:a:b`.
	 */
	scope(scope: string): ILogger;
}
