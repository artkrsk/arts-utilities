import { LogLevel } from "../constants";

/**
 * Logger configuration interface
 */
export interface ILoggerConfig {
  enabled: boolean;
  level: LogLevel;
  prefix?: string;
}

/**
 * Interface for the logger functionality
 */
export interface ILogger {
  /**
   * Configure logger
   */
  configure(config: Partial<ILoggerConfig>): void;

  /**
   * Log error message
   */
  error(message: string, ...args: any[]): void;

  /**
   * Log warning message
   */
  warn(message: string, ...args: any[]): void;

  /**
   * Log info message
   */
  info(message: string, ...args: any[]): void;

  /**
   * Log debug message
   */
  debug(message: string, ...args: any[]): void;

  /**
   * Create a scoped logger for a specific service
   */
  scope(scope: string): ILogger;
}
