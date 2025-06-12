import type { ILogger, ILoggerConfig } from '../interfaces'
import { LogLevel } from '../constants'

/**
 * Centralized logger for the component manager
 */
export class LoggerClass implements ILogger {
  private static instance: LoggerClass
  private config: ILoggerConfig = {
    enabled: true,
    level: LogLevel.DEBUG,
    prefix: ''
  }

  private constructor() {}

  /**
   * Get logger instance (Singleton)
   */
  public static getInstance(): LoggerClass {
    if (!LoggerClass.instance) {
      LoggerClass.instance = new LoggerClass()
    }
    return LoggerClass.instance
  }

  /**
   * Configure logger
   */
  public configure(config: Partial<ILoggerConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Log error message
   */
  public error(message: string, ...args: any[]): void {
    if (this.config.enabled && this.config.level >= LogLevel.ERROR) {
      console.error(`${this.config.prefix} [ERROR] ${message}`, ...args)
    }
  }

  /**
   * Log warning message
   */
  public warn(message: string, ...args: any[]): void {
    if (this.config.enabled && this.config.level >= LogLevel.WARN) {
      console.warn(`${this.config.prefix} [WARN] ${message}`, ...args)
    }
  }

  /**
   * Log info message
   */
  public info(message: string, ...args: any[]): void {
    if (this.config.enabled && this.config.level >= LogLevel.INFO) {
      console.info(`${this.config.prefix} [INFO] ${message}`, ...args)
    }
  }

  /**
   * Log debug message
   */
  public debug(message: string, ...args: any[]): void {
    if (this.config.enabled && this.config.level >= LogLevel.DEBUG) {
      console.debug(`${this.config.prefix} [DEBUG] ${message}`, ...args)
    }
  }

  /**
   * Create a scoped logger for a specific service
   */
  public scope(scope: string): ILogger {
    const scopedLogger = new LoggerClass()
    scopedLogger.configure({
      ...this.config,
      prefix: `${this.config.prefix}:${scope}`
    })
    return scopedLogger
  }
}

// Create and export default logger instance
export const Logger: ILogger = LoggerClass.getInstance()
