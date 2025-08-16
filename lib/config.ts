import { ErrorHandler } from './error-handler'

export interface AppConfig {
  // API Configuration
  openaiApiKey: string
  openaiBaseUrl: string
  
  // Authentication
  jwtSecret: string
  sessionDuration: number
  
  // File Upload
  maxFileSizeMB: number
  allowedFileTypes: string[]
  
  // Environment
  isDevelopment: boolean
  isProduction: boolean
  
  // Features
  enableAnalytics: boolean
  enableDebugLogging: boolean
}

class ConfigManager {
  private config: AppConfig

  constructor() {
    this.config = this.loadConfig()
    this.validateConfig()
  }

  private loadConfig(): AppConfig {
    return {
      // API Configuration
      openaiApiKey: process.env.OPENAI_API_KEY || '',
      openaiBaseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
      
      // Authentication
      jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      sessionDuration: parseInt(process.env.SESSION_DURATION_HOURS || '24') * 60 * 60 * 1000,
      
      // File Upload
      maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB || '50'),
      allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document').split(','),
      
      // Environment
      isDevelopment: process.env.NODE_ENV === 'development',
      isProduction: process.env.NODE_ENV === 'production',
      
      // Features
      enableAnalytics: process.env.ENABLE_ANALYTICS !== 'false',
      enableDebugLogging: process.env.ENABLE_DEBUG_LOGGING === 'true',
    }
  }

  private validateConfig(): void {
    const errors: string[] = []

    // Validate required fields
    if (!this.config.openaiApiKey && this.config.isProduction) {
      errors.push('OPENAI_API_KEY is required in production')
    }

    if (this.config.jwtSecret === 'your-secret-key-change-in-production' && this.config.isProduction) {
      errors.push('JWT_SECRET must be changed in production')
    }

    if (this.config.maxFileSizeMB <= 0) {
      errors.push('MAX_FILE_SIZE_MB must be greater than 0')
    }

    if (this.config.allowedFileTypes.length === 0) {
      errors.push('At least one file type must be allowed')
    }

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed:\n${errors.join('\n')}`)
    }
  }

  get(): AppConfig {
    return { ...this.config }
  }

  getValue<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key]
  }

  isFeatureEnabled(feature: keyof Pick<AppConfig, 'enableAnalytics' | 'enableDebugLogging'>): boolean {
    return this.config[feature]
  }

  getOpenAIConfig() {
    return {
      apiKey: this.config.openaiApiKey,
      baseUrl: this.config.openaiBaseUrl,
    }
  }

  getAuthConfig() {
    return {
      jwtSecret: this.config.jwtSecret,
      sessionDuration: this.config.sessionDuration,
    }
  }

  getFileUploadConfig() {
    return {
      maxFileSizeMB: this.config.maxFileSizeMB,
      allowedFileTypes: this.config.allowedFileTypes,
    }
  }
}

export const config = new ConfigManager()

// Helper functions for common config checks
export const isProduction = () => config.getValue('isProduction')
export const isDevelopment = () => config.getValue('isDevelopment')
export const getOpenAIApiKey = () => config.getValue('openaiApiKey')
export const getJWTSecret = () => config.getValue('jwtSecret')
