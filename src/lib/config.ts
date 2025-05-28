// Global configuration management system
export interface PlatformConfig {
  general: {
    platformName: string
    platformUrl: string
    supportEmail: string
    maintenanceMode: boolean
    registrationEnabled: boolean
    demoMode: boolean
  }
  sweepstakes: {
    minBetAmount: number
    maxBetAmount: number
    houseFeePercentage: number
    maxParticipants: number
    minParticipants: number
    autoDrawDelay: number // seconds
    allowCancellation: boolean
  }
  payments: {
    minDeposit: number
    maxDeposit: number
    minWithdrawal: number
    maxWithdrawal: number
    dailyWithdrawalLimit: number
    monthlyWithdrawalLimit: number
    processingFee: number
    enabledMethods: string[]
  }
  security: {
    maxLoginAttempts: number
    lockoutDuration: number // minutes
    sessionTimeout: number // minutes
    requireEmailVerification: boolean
    require2FA: boolean
    passwordMinLength: number
    enableRateLimit: boolean
    maxRequestsPerMinute: number
  }
  notifications: {
    enableEmail: boolean
    enableSMS: boolean
    enablePush: boolean
    enableInApp: boolean
    emailTemplates: Record<string, boolean>
  }
  features: {
    enableChat: boolean
    enableAffiliate: boolean
    enableRankings: boolean
    enableDemo: boolean
    enableGamification: boolean
    enableAnalytics: boolean
  }
  limits: {
    maxChatMessageLength: number
    maxChatMessagesPerMinute: number
    maxFileUploadSize: number // bytes
    maxAvatarSize: number // bytes
    sessionStorageLimit: number // MB
  }
  ui: {
    theme: 'dark' | 'light' | 'auto'
    primaryColor: string
    secondaryColor: string
    enableAnimations: boolean
    enableSounds: boolean
    defaultLanguage: string
    supportedLanguages: string[]
  }
}

// Default configuration
const defaultConfig: PlatformConfig = {
  general: {
    platformName: 'Chronos Platform',
    platformUrl: 'https://chronosplatform.com',
    supportEmail: 'suporte@chronosplatform.com',
    maintenanceMode: false,
    registrationEnabled: true,
    demoMode: false
  },
  sweepstakes: {
    minBetAmount: 1.50,
    maxBetAmount: 32.50,
    houseFeePercentage: 0.50,
    maxParticipants: 50,
    minParticipants: 2,
    autoDrawDelay: 30,
    allowCancellation: true
  },
  payments: {
    minDeposit: 10.00,
    maxDeposit: 10000.00,
    minWithdrawal: 10.00,
    maxWithdrawal: 5000.00,
    dailyWithdrawalLimit: 5000.00,
    monthlyWithdrawalLimit: 50000.00,
    processingFee: 0.00,
    enabledMethods: ['pix', 'bank_transfer', 'credit_card']
  },
  security: {
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    sessionTimeout: 60,
    requireEmailVerification: true,
    require2FA: false,
    passwordMinLength: 8,
    enableRateLimit: true,
    maxRequestsPerMinute: 100
  },
  notifications: {
    enableEmail: true,
    enableSMS: false,
    enablePush: true,
    enableInApp: true,
    emailTemplates: {
      welcome: true,
      sweepstakeWin: true,
      depositConfirmation: true,
      withdrawalRequest: true,
      securityAlert: true
    }
  },
  features: {
    enableChat: true,
    enableAffiliate: true,
    enableRankings: true,
    enableDemo: true,
    enableGamification: true,
    enableAnalytics: true
  },
  limits: {
    maxChatMessageLength: 200,
    maxChatMessagesPerMinute: 10,
    maxFileUploadSize: 5 * 1024 * 1024, // 5MB
    maxAvatarSize: 2 * 1024 * 1024, // 2MB
    sessionStorageLimit: 10 // 10MB
  },
  ui: {
    theme: 'dark',
    primaryColor: '#D4AF37',
    secondaryColor: '#7B1818',
    enableAnimations: true,
    enableSounds: false,
    defaultLanguage: 'pt-BR',
    supportedLanguages: ['pt-BR', 'en-US', 'es-ES']
  }
}

// In-memory config store (in production, use database)
let currentConfig: PlatformConfig = { ...defaultConfig }
const configListeners: Array<(config: PlatformConfig) => void> = []

export class ConfigManager {
  // Get current configuration
  static getConfig(): PlatformConfig {
    return { ...currentConfig }
  }

  // Get specific config section
  static getSection<K extends keyof PlatformConfig>(section: K): PlatformConfig[K] {
    return { ...currentConfig[section] }
  }

  // Get specific config value
  static getValue<K extends keyof PlatformConfig, V extends keyof PlatformConfig[K]>(
    section: K,
    key: V
  ): PlatformConfig[K][V] {
    return currentConfig[section][key]
  }

  // Update configuration
  static async updateConfig(updates: Partial<PlatformConfig>): Promise<void> {
    try {
      // Validate updates
      const validatedUpdates = this.validateConfig(updates)
      
      // Merge with current config
      currentConfig = this.deepMerge(currentConfig, validatedUpdates)
      
      // In production, save to database
      await this.saveToDatabase(currentConfig)
      
      // Notify listeners
      this.notifyListeners(currentConfig)
      
      console.log('⚙️ Configuration updated successfully')
    } catch (error) {
      console.error('⚙️ Failed to update configuration:', error)
      throw error
    }
  }

  // Update specific section
  static async updateSection<K extends keyof PlatformConfig>(
    section: K,
    updates: Partial<PlatformConfig[K]>
  ): Promise<void> {
    const sectionUpdates = { [section]: updates } as Partial<PlatformConfig>
    await this.updateConfig(sectionUpdates)
  }

  // Reset to default configuration
  static async resetToDefault(): Promise<void> {
    currentConfig = { ...defaultConfig }
    await this.saveToDatabase(currentConfig)
    this.notifyListeners(currentConfig)
    console.log('⚙️ Configuration reset to default')
  }

  // Load configuration from database
  static async loadFromDatabase(): Promise<void> {
    try {
      // In production, load from database
      // const config = await prisma.config.findFirst()
      // if (config) {
      //   currentConfig = JSON.parse(config.data)
      // }
      
      console.log('⚙️ Configuration loaded from database')
    } catch (error) {
      console.error('⚙️ Failed to load configuration from database:', error)
      // Use default config if loading fails
      currentConfig = { ...defaultConfig }
    }
  }

  // Subscribe to configuration changes
  static subscribe(listener: (config: PlatformConfig) => void): () => void {
    configListeners.push(listener)
    
    // Return unsubscribe function
    return () => {
      const index = configListeners.indexOf(listener)
      if (index > -1) {
        configListeners.splice(index, 1)
      }
    }
  }

  // Validate configuration updates
  private static validateConfig(updates: Partial<PlatformConfig>): Partial<PlatformConfig> {
    const validated = { ...updates }

    // Validate sweepstakes config
    if (validated.sweepstakes) {
      const s = validated.sweepstakes
      if (s.minBetAmount && s.maxBetAmount && s.minBetAmount >= s.maxBetAmount) {
        throw new Error('minBetAmount must be less than maxBetAmount')
      }
      if (s.minParticipants && s.maxParticipants && s.minParticipants >= s.maxParticipants) {
        throw new Error('minParticipants must be less than maxParticipants')
      }
      if (s.houseFeePercentage && (s.houseFeePercentage < 0 || s.houseFeePercentage > 100)) {
        throw new Error('houseFeePercentage must be between 0 and 100')
      }
    }

    // Validate payments config
    if (validated.payments) {
      const p = validated.payments
      if (p.minDeposit && p.maxDeposit && p.minDeposit >= p.maxDeposit) {
        throw new Error('minDeposit must be less than maxDeposit')
      }
      if (p.minWithdrawal && p.maxWithdrawal && p.minWithdrawal >= p.maxWithdrawal) {
        throw new Error('minWithdrawal must be less than maxWithdrawal')
      }
    }

    // Validate security config
    if (validated.security) {
      const s = validated.security
      if (s.maxLoginAttempts && s.maxLoginAttempts < 1) {
        throw new Error('maxLoginAttempts must be at least 1')
      }
      if (s.passwordMinLength && s.passwordMinLength < 6) {
        throw new Error('passwordMinLength must be at least 6')
      }
    }

    return validated
  }

  // Deep merge objects
  private static deepMerge(target: any, source: any): any {
    const result = { ...target }
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key])
      } else {
        result[key] = source[key]
      }
    }
    
    return result
  }

  // Save configuration to database
  private static async saveToDatabase(config: PlatformConfig): Promise<void> {
    try {
      // In production, save to database
      // await prisma.config.upsert({
      //   where: { id: 1 },
      //   update: { data: JSON.stringify(config) },
      //   create: { id: 1, data: JSON.stringify(config) }
      // })
      
      console.log('⚙️ Configuration saved to database')
    } catch (error) {
      console.error('⚙️ Failed to save configuration to database:', error)
      throw error
    }
  }

  // Notify configuration listeners
  private static notifyListeners(config: PlatformConfig): void {
    configListeners.forEach(listener => {
      try {
        listener(config)
      } catch (error) {
        console.error('⚙️ Error in config listener:', error)
      }
    })
  }

  // Get configuration schema for admin UI
  static getConfigSchema(): Record<string, any> {
    return {
      general: {
        title: 'Configurações Gerais',
        fields: {
          platformName: { type: 'string', label: 'Nome da Plataforma' },
          platformUrl: { type: 'url', label: 'URL da Plataforma' },
          supportEmail: { type: 'email', label: 'Email de Suporte' },
          maintenanceMode: { type: 'boolean', label: 'Modo Manutenção' },
          registrationEnabled: { type: 'boolean', label: 'Registro Habilitado' },
          demoMode: { type: 'boolean', label: 'Modo Demo' }
        }
      },
      sweepstakes: {
        title: 'Configurações de Sorteios',
        fields: {
          minBetAmount: { type: 'number', label: 'Aposta Mínima (R$)', min: 0.01 },
          maxBetAmount: { type: 'number', label: 'Aposta Máxima (R$)', min: 0.01 },
          houseFeePercentage: { type: 'number', label: 'Taxa da Casa (%)', min: 0, max: 100 },
          maxParticipants: { type: 'number', label: 'Máx. Participantes', min: 2 },
          minParticipants: { type: 'number', label: 'Mín. Participantes', min: 2 },
          autoDrawDelay: { type: 'number', label: 'Delay Auto-Sorteio (s)', min: 10 }
        }
      },
      payments: {
        title: 'Configurações de Pagamento',
        fields: {
          minDeposit: { type: 'number', label: 'Depósito Mínimo (R$)', min: 1 },
          maxDeposit: { type: 'number', label: 'Depósito Máximo (R$)', min: 1 },
          minWithdrawal: { type: 'number', label: 'Saque Mínimo (R$)', min: 1 },
          maxWithdrawal: { type: 'number', label: 'Saque Máximo (R$)', min: 1 },
          dailyWithdrawalLimit: { type: 'number', label: 'Limite Diário Saque (R$)' },
          monthlyWithdrawalLimit: { type: 'number', label: 'Limite Mensal Saque (R$)' }
        }
      },
      security: {
        title: 'Configurações de Segurança',
        fields: {
          maxLoginAttempts: { type: 'number', label: 'Máx. Tentativas Login', min: 1 },
          lockoutDuration: { type: 'number', label: 'Duração Bloqueio (min)', min: 1 },
          sessionTimeout: { type: 'number', label: 'Timeout Sessão (min)', min: 5 },
          requireEmailVerification: { type: 'boolean', label: 'Verificação Email Obrigatória' },
          require2FA: { type: 'boolean', label: '2FA Obrigatório' },
          passwordMinLength: { type: 'number', label: 'Tamanho Mín. Senha', min: 6 }
        }
      }
    }
  }
}

// React hook for configuration
export function useConfig() {
  const [config, setConfig] = React.useState<PlatformConfig>(ConfigManager.getConfig())

  React.useEffect(() => {
    const unsubscribe = ConfigManager.subscribe(setConfig)
    return unsubscribe
  }, [])

  return config
}

// Initialize configuration on startup
ConfigManager.loadFromDatabase()
