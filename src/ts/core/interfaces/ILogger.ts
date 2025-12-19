import { LogLevel } from '../constants'

/**
 * Logger configuration interface for customizing logger behavior.
 *
 * @example
 * ```typescript
 * const config: ILoggerConfig = {
 *   enabled: true,
 *   level: LogLevel.DEBUG,
 *   prefix: '[MyApp]'
 * }
 *
 * logger.configure(config)
 * ```
 */
export interface ILoggerConfig {
  /**
   * Whether logging is enabled globally.
   * When false, all log methods become no-ops.
   */
  enabled: boolean

  /**
   * Minimum log level to output.
   * Messages below this level will be filtered out.
   *
   * @example
   * ```typescript
   * // With level set to LogLevel.WARN:
   * logger.debug('Debug message')  // Filtered out
   * logger.info('Info message')    // Filtered out
   * logger.warn('Warning message') // Logged
   * logger.error('Error message')  // Logged
   * ```
   */
  level: LogLevel

  /**
   * Optional prefix to prepend to all log messages.
   * Useful for identifying the source of log messages.
   *
   * @example
   * ```typescript
   * // With prefix '[UI]':
   * logger.info('Button clicked')
   * // Output: "[UI] [INFO] Button clicked"
   * ```
   */
  prefix?: string
}

/**
 * Interface for the logger functionality providing structured logging capabilities.
 * Supports different log levels, scoped loggers, and configurable output formatting.
 *
 * @example
 * ```typescript
 * // Example 1: Basic logging
 * const logger = Logger.getInstance()
 * logger.info('Application started')
 * logger.warn('API response slow', { responseTime: 2000 })
 * logger.error('Database connection failed', error)
 *
 * // Example 2: Scoped logging for different modules
 * const apiLogger = logger.scope('API')
 * const dbLogger = logger.scope('Database')
 *
 * apiLogger.info('Making request to /users')    // Output: "[API] [INFO] Making request to /users"
 * dbLogger.error('Connection timeout')          // Output: "[Database] [ERROR] Connection timeout"
 *
 * // Example 3: Configuration and level filtering
 * logger.configure({
 *   enabled: true,
 *   level: LogLevel.WARN,
 *   prefix: '[MyApp]'
 * })
 *
 * logger.debug('Debug info')  // Not logged (below WARN level)
 * logger.info('User action')  // Not logged (below WARN level)
 * logger.warn('Slow query')   // Logged: "[MyApp] [WARN] Slow query"
 * logger.error('Failed')      // Logged: "[MyApp] [ERROR] Failed"
 *
 * // Example 4: Development vs Production
 * if (process.env.NODE_ENV === 'development') {
 *   logger.configure({ level: LogLevel.DEBUG })
 * } else {
 *   logger.configure({ level: LogLevel.ERROR })
 * }
 * ```
 */
export interface ILogger {
  /**
   * Configure logger settings such as log level, prefix, and enabled state.
   *
   * @param config - Partial configuration object (only specified properties are updated)
   *
   * @example
   * ```typescript
   * // Enable debug mode for development
   * logger.configure({ level: LogLevel.DEBUG })
   *
   * // Add application prefix
   * logger.configure({ prefix: '[MyApp]' })
   *
   * // Disable logging entirely
   * logger.configure({ enabled: false })
   * ```
   */
  configure(config: Partial<ILoggerConfig>): void

  /**
   * Log error message with ERROR level.
   * Use for critical issues that need immediate attention.
   *
   * @param message - Error message to log
   * @param args - Additional arguments (error objects, context data, etc.)
   *
   * @example
   * ```typescript
   * logger.error('Database connection failed')
   * logger.error('API request failed', { url: '/users', status: 500 })
   * logger.error('Unhandled exception', error, { userId: 123 })
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message: string, ...args: any[]): void

  /**
   * Log warning message with WARN level.
   * Use for issues that don't break functionality but need attention.
   *
   * @param message - Warning message to log
   * @param args - Additional arguments (context data, performance metrics, etc.)
   *
   * @example
   * ```typescript
   * logger.warn('API response time exceeded threshold', { time: 2000 })
   * logger.warn('Deprecated function used', { function: 'oldMethod' })
   * logger.warn('Cache miss for frequently accessed data', { key: 'user:123' })
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(message: string, ...args: any[]): void

  /**
   * Log informational message with INFO level.
   * Use for general application flow and important events.
   *
   * @param message - Information message to log
   * @param args - Additional arguments (event data, user context, etc.)
   *
   * @example
   * ```typescript
   * logger.info('User logged in', { userId: 123, timestamp: Date.now() })
   * logger.info('File uploaded successfully', { filename: 'document.pdf', size: 1024 })
   * logger.info('Background job completed', { jobId: 'cleanup-001', duration: 5000 })
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(message: string, ...args: any[]): void

  /**
   * Log debug message with DEBUG level.
   * Use for detailed information during development and troubleshooting.
   *
   * @param message - Debug message to log
   * @param args - Additional arguments (variable values, execution flow, etc.)
   *
   * @example
   * ```typescript
   * logger.debug('Function called with parameters', { params: { id: 123, type: 'user' } })
   * logger.debug('Cache hit', { key: 'config:theme', value: 'dark' })
   * logger.debug('State transition', { from: 'loading', to: 'loaded', data: response })
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(message: string, ...args: any[]): void

  /**
   * Create a scoped logger for a specific service or module.
   * Scoped loggers inherit configuration but add their own prefix.
   *
   * @param scope - Scope identifier (module name, service name, etc.)
   * @returns New logger instance with the specified scope
   *
   * @example
   * ```typescript
   * // Create loggers for different application areas
   * const authLogger = logger.scope('Auth')
   * const apiLogger = logger.scope('API')
   * const dbLogger = logger.scope('Database')
   *
   * authLogger.info('User authenticated')  // Output: "[Auth] [INFO] User authenticated"
   * apiLogger.warn('Rate limit exceeded')  // Output: "[API] [WARN] Rate limit exceeded"
   * dbLogger.error('Query failed')         // Output: "[Database] [ERROR] Query failed"
   *
   * // Nested scoping
   * const userApiLogger = apiLogger.scope('Users')
   * userApiLogger.info('Fetching user list')  // Output: "[API:Users] [INFO] Fetching user list"
   * ```
   */
  scope(scope: string): ILogger
}
