import { LogLevel } from "../constants";
import type { ILogger, ILoggerConfig } from "../interfaces";

/**
 * Singleton logger. Obtain shared state via `Logger`; create independent loggers via `LoggerClass.getInstance().scope(name)`.
 */
export class LoggerClass implements ILogger {
	private static instance: LoggerClass;
	private config: ILoggerConfig = {
		enabled: true,
		level: LogLevel.DEBUG,
		prefix: "",
	};

	private constructor() {}

	public static getInstance(): LoggerClass {
		if (!LoggerClass.instance) {
			LoggerClass.instance = new LoggerClass();
		}
		return LoggerClass.instance;
	}

	public configure(config: Partial<ILoggerConfig>): void {
		this.config = { ...this.config, ...config };
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public error(message: string, ...args: any[]): void {
		if (this.config.enabled && this.config.level >= LogLevel.ERROR) {
			console.error(`${this.config.prefix} [ERROR] ${message}`, ...args);
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public warn(message: string, ...args: any[]): void {
		if (this.config.enabled && this.config.level >= LogLevel.WARN) {
			console.warn(`${this.config.prefix} [WARN] ${message}`, ...args);
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public info(message: string, ...args: any[]): void {
		if (this.config.enabled && this.config.level >= LogLevel.INFO) {
			// eslint-disable-next-line no-console
			console.info(`${this.config.prefix} [INFO] ${message}`, ...args);
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public debug(message: string, ...args: any[]): void {
		if (this.config.enabled && this.config.level >= LogLevel.DEBUG) {
			// eslint-disable-next-line no-console
			console.debug(`${this.config.prefix} [DEBUG] ${message}`, ...args);
		}
	}

	public scope(scope: string): ILogger {
		const scopedLogger = new LoggerClass();
		scopedLogger.configure({
			...this.config,
			prefix: `${this.config.prefix}:${scope}`,
		});
		return scopedLogger;
	}
}

export const Logger: ILogger = LoggerClass.getInstance();
