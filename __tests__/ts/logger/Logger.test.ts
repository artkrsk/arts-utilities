import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Logger, LoggerClass } from '../../../src/ts/core/logger/Logger'
import { LogLevel } from '../../../src/ts/core/constants/defaultLogLevel'

describe('Logger', () => {
  beforeEach(() => {
    // Spy on console methods
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.spyOn(console, 'debug').mockImplementation(() => {})

    // Reset logger configuration before each test
    Logger.configure({
      enabled: true,
      level: LogLevel.DEBUG,
      prefix: '[TEST]'
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Singleton Pattern', () => {
    it('should always return the same instance', () => {
      // @ts-ignore - Accessing private static instance for testing
      const initialInstance = LoggerClass.instance

      const instance1 = LoggerClass.getInstance()
      const instance2 = LoggerClass.getInstance()

      expect(instance1).toBe(instance2)
      expect(instance1).toBe(initialInstance)
    })
  })

  describe('Configuration', () => {
    it('should apply partial configuration', () => {
      Logger.configure({ level: LogLevel.ERROR })

      Logger.debug('This should not log')
      expect(console.debug).not.toHaveBeenCalled()

      Logger.error('This should log')
      expect(console.error).toHaveBeenCalledTimes(1)
    })

    it('should merge configuration with defaults', () => {
      Logger.configure({
        level: LogLevel.INFO
      })

      // Debug shouldn't log (level is INFO)
      Logger.debug('Debug message')
      expect(console.debug).not.toHaveBeenCalled()

      // Info should log (level is INFO)
      Logger.info('Info message')
      expect(console.info).toHaveBeenCalledTimes(1)
    })
  })

  describe('Logging Methods', () => {
    it('should log error messages when level is ERROR or higher', () => {
      Logger.configure({ level: LogLevel.ERROR })
      Logger.error('Error message', { data: 'test' })

      expect(console.error).toHaveBeenCalledWith('[TEST] [ERROR] Error message', { data: 'test' })
    })

    it('should log warning messages when level is WARN or higher', () => {
      Logger.configure({ level: LogLevel.WARN })

      Logger.warn('Warning message')
      expect(console.warn).toHaveBeenCalledWith('[TEST] [WARN] Warning message')

      Logger.error('Error message')
      expect(console.error).toHaveBeenCalledWith('[TEST] [ERROR] Error message')

      Logger.info('Info message')
      expect(console.info).not.toHaveBeenCalled()
    })

    it('should log info messages when level is INFO or higher', () => {
      Logger.configure({ level: LogLevel.INFO })

      Logger.info('Info message')
      expect(console.info).toHaveBeenCalledWith('[TEST] [INFO] Info message')

      Logger.debug('Debug message')
      expect(console.debug).not.toHaveBeenCalled()
    })

    it('should log debug messages when level is DEBUG', () => {
      Logger.configure({ level: LogLevel.DEBUG })

      Logger.debug('Debug message')
      expect(console.debug).toHaveBeenCalledWith('[TEST] [DEBUG] Debug message')
    })

    it('should not log any messages when logging is disabled', () => {
      Logger.configure({ enabled: false })

      Logger.error('Error message')
      Logger.warn('Warning message')
      Logger.info('Info message')
      Logger.debug('Debug message')

      expect(console.error).not.toHaveBeenCalled()
      expect(console.warn).not.toHaveBeenCalled()
      expect(console.info).not.toHaveBeenCalled()
      expect(console.debug).not.toHaveBeenCalled()
    })
  })

  describe('Scoped Logger', () => {
    it('should create a scoped logger with extended prefix', () => {
      const scopedLogger = Logger.scope('Component')

      scopedLogger.info('Info from component')

      expect(console.info).toHaveBeenCalledWith('[TEST]:Component [INFO] Info from component')
    })

    it('should maintain log level settings in scoped logger', () => {
      Logger.configure({ level: LogLevel.WARN })

      const scopedLogger = Logger.scope('Component')

      scopedLogger.debug('Debug message')
      scopedLogger.info('Info message')

      expect(console.debug).not.toHaveBeenCalled()
      expect(console.info).not.toHaveBeenCalled()

      scopedLogger.warn('Warning message')
      expect(console.warn).toHaveBeenCalledWith('[TEST]:Component [WARN] Warning message')
    })

    it('should allow multiple levels of scope', () => {
      const level1Logger = Logger.scope('Level1')
      const level2Logger = level1Logger.scope('Level2')

      level2Logger.info('Nested scope message')

      expect(console.info).toHaveBeenCalledWith('[TEST]:Level1:Level2 [INFO] Nested scope message')
    })
  })
})
