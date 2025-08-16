export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

class Logger {
  private level: LogLevel = LogLevel.INFO

  setLevel(level: LogLevel) {
    this.level = level
  }

  debug(message: string, data?: any) {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, data)
    }
  }

  info(message: string, data?: any) {
    if (this.level <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, data)
    }
  }

  warn(message: string, data?: any) {
    if (this.level <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, data)
    }
  }

  error(message: string, error?: any) {
    if (this.level <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, error)
    }
  }
}

export const logger = new Logger()

export class ErrorHandler {
  static handle(error: any, context: string, showUserNotification = false): void {
    const errorMessage = error?.message || 'An unknown error occurred'
    const fullMessage = `${context}: ${errorMessage}`
    
    logger.error(fullMessage, error)
    
    if (showUserNotification) {
      // In a real app, you'd show a toast notification here
      // For now, we'll just log it
      logger.warn(`User should be notified: ${fullMessage}`)
    }
  }

  static async wrapAsync<T>(
    asyncFn: () => Promise<T>, 
    context: string, 
    fallback?: T
  ): Promise<T> {
    try {
      return await asyncFn()
    } catch (error) {
      this.handle(error, context)
      if (fallback !== undefined) {
        return fallback
      }
      throw error
    }
  }

  static validateRequired(value: any, fieldName: string): void {
    if (value === null || value === undefined || value === '') {
      throw new Error(`${fieldName} is required`)
    }
  }

  static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format')
    }
  }

  static validateFileSize(file: File, maxSizeMB: number): void {
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      throw new Error(`File size must be less than ${maxSizeMB}MB`)
    }
  }

  static validateFileType(file: File, allowedTypes: string[]): void {
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`)
    }
  }
}
