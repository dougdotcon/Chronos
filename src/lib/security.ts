import { NextRequest } from 'next/server'
import crypto from 'crypto'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Security configuration
export const securityConfig = {
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // limit each IP to 100 requests per windowMs
    skipSuccessfulRequests: false
  },
  bruteForce: {
    freeRetries: 5,
    minWait: 5 * 60 * 1000, // 5 minutes
    maxWait: 60 * 60 * 1000, // 1 hour
    failuresBeforeBrute: 5
  },
  fraud: {
    maxDepositPerHour: 10000, // R$ 10,000
    maxWithdrawalPerDay: 50000, // R$ 50,000
    suspiciousPatterns: {
      rapidTransactions: 10, // max transactions per minute
      unusualAmounts: [0.01, 999999], // suspicious amounts
      multipleFailedAttempts: 5
    }
  }
}

// Rate limiting middleware
export class RateLimiter {
  static check(identifier: string, limit: number = securityConfig.rateLimit.maxRequests): boolean {
    const now = Date.now()
    const windowStart = now - securityConfig.rateLimit.windowMs
    
    const record = rateLimitStore.get(identifier)
    
    if (!record || record.resetTime < now) {
      // Create new record or reset expired one
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + securityConfig.rateLimit.windowMs
      })
      return true
    }
    
    if (record.count >= limit) {
      return false // Rate limit exceeded
    }
    
    // Increment count
    record.count++
    rateLimitStore.set(identifier, record)
    return true
  }
  
  static getClientIdentifier(request: NextRequest): string {
    // Get IP address
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown'
    
    // Include user agent for more specific identification
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const hash = crypto.createHash('md5').update(ip + userAgent).digest('hex')
    
    return hash.substring(0, 16)
  }
}

// Brute force protection
export class BruteForceProtection {
  private static attempts = new Map<string, { count: number; lastAttempt: number; blockedUntil?: number }>()
  
  static recordFailedAttempt(identifier: string): void {
    const now = Date.now()
    const record = this.attempts.get(identifier) || { count: 0, lastAttempt: now }
    
    record.count++
    record.lastAttempt = now
    
    // Calculate block time based on number of attempts
    if (record.count >= securityConfig.bruteForce.failuresBeforeBrute) {
      const blockDuration = Math.min(
        securityConfig.bruteForce.minWait * Math.pow(2, record.count - securityConfig.bruteForce.failuresBeforeBrute),
        securityConfig.bruteForce.maxWait
      )
      record.blockedUntil = now + blockDuration
    }
    
    this.attempts.set(identifier, record)
  }
  
  static recordSuccessfulAttempt(identifier: string): void {
    this.attempts.delete(identifier)
  }
  
  static isBlocked(identifier: string): boolean {
    const record = this.attempts.get(identifier)
    if (!record) return false
    
    const now = Date.now()
    
    // Check if block has expired
    if (record.blockedUntil && record.blockedUntil < now) {
      this.attempts.delete(identifier)
      return false
    }
    
    return record.blockedUntil ? record.blockedUntil > now : false
  }
  
  static getBlockTimeRemaining(identifier: string): number {
    const record = this.attempts.get(identifier)
    if (!record || !record.blockedUntil) return 0
    
    return Math.max(0, record.blockedUntil - Date.now())
  }
}

// Fraud detection system
export class FraudDetection {
  private static userActivity = new Map<string, {
    transactions: Array<{ amount: number; type: 'deposit' | 'withdrawal'; timestamp: number }>
    failedAttempts: number
    lastActivity: number
  }>()
  
  static recordTransaction(userId: string, amount: number, type: 'deposit' | 'withdrawal'): void {
    const now = Date.now()
    const activity = this.userActivity.get(userId) || {
      transactions: [],
      failedAttempts: 0,
      lastActivity: now
    }
    
    // Add new transaction
    activity.transactions.push({ amount, type, timestamp: now })
    activity.lastActivity = now
    
    // Keep only last 24 hours of transactions
    const dayAgo = now - (24 * 60 * 60 * 1000)
    activity.transactions = activity.transactions.filter(t => t.timestamp > dayAgo)
    
    this.userActivity.set(userId, activity)
  }
  
  static recordFailedAttempt(userId: string): void {
    const activity = this.userActivity.get(userId) || {
      transactions: [],
      failedAttempts: 0,
      lastActivity: Date.now()
    }
    
    activity.failedAttempts++
    activity.lastActivity = Date.now()
    
    this.userActivity.set(userId, activity)
  }
  
  static checkSuspiciousActivity(userId: string, amount: number, type: 'deposit' | 'withdrawal'): {
    isSuspicious: boolean
    reasons: string[]
    riskLevel: 'low' | 'medium' | 'high'
  } {
    const activity = this.userActivity.get(userId)
    const reasons: string[] = []
    let riskLevel: 'low' | 'medium' | 'high' = 'low'
    
    if (!activity) {
      return { isSuspicious: false, reasons, riskLevel }
    }
    
    const now = Date.now()
    const hourAgo = now - (60 * 60 * 1000)
    const dayAgo = now - (24 * 60 * 60 * 1000)
    
    // Check for rapid transactions
    const recentTransactions = activity.transactions.filter(t => t.timestamp > hourAgo)
    if (recentTransactions.length >= securityConfig.fraud.suspiciousPatterns.rapidTransactions) {
      reasons.push('Muitas transações em pouco tempo')
      riskLevel = 'medium'
    }
    
    // Check for unusual amounts
    const [minSuspicious, maxSuspicious] = securityConfig.fraud.suspiciousPatterns.unusualAmounts
    if (amount <= minSuspicious || amount >= maxSuspicious) {
      reasons.push('Valor suspeito')
      riskLevel = 'medium'
    }
    
    // Check daily limits
    const todayTransactions = activity.transactions.filter(t => t.timestamp > dayAgo && t.type === type)
    const todayTotal = todayTransactions.reduce((sum, t) => sum + t.amount, 0)
    
    if (type === 'deposit' && todayTotal + amount > securityConfig.fraud.maxDepositPerHour) {
      reasons.push('Limite de depósito diário excedido')
      riskLevel = 'high'
    }
    
    if (type === 'withdrawal' && todayTotal + amount > securityConfig.fraud.maxWithdrawalPerDay) {
      reasons.push('Limite de saque diário excedido')
      riskLevel = 'high'
    }
    
    // Check for multiple failed attempts
    if (activity.failedAttempts >= securityConfig.fraud.suspiciousPatterns.multipleFailedAttempts) {
      reasons.push('Múltiplas tentativas falharam recentemente')
      riskLevel = 'high'
    }
    
    return {
      isSuspicious: reasons.length > 0,
      reasons,
      riskLevel
    }
  }
}

// Security logging
export class SecurityLogger {
  static log(event: string, details: any, severity: 'info' | 'warning' | 'critical' = 'info'): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      severity,
      source: 'security-system'
    }
    
    // In production, send to logging service
    console.log(`🛡️ [SECURITY ${severity.toUpperCase()}]`, logEntry)
    
    // For critical events, could trigger alerts
    if (severity === 'critical') {
      this.triggerAlert(logEntry)
    }
  }
  
  private static triggerAlert(logEntry: any): void {
    // In production, send to monitoring system (Slack, email, etc.)
    console.log('🚨 CRITICAL SECURITY ALERT:', logEntry)
  }
}

// Input validation and sanitization
export class InputValidator {
  static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 1000) // Limit length
  }
  
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 254
  }
  
  static validateCPF(cpf: string): boolean {
    // Remove formatting
    cpf = cpf.replace(/[^\d]/g, '')
    
    // Check length
    if (cpf.length !== 11) return false
    
    // Check for repeated digits
    if (/^(\d)\1{10}$/.test(cpf)) return false
    
    // Validate check digits
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf[i]) * (10 - i)
    }
    let digit1 = 11 - (sum % 11)
    if (digit1 > 9) digit1 = 0
    
    if (parseInt(cpf[9]) !== digit1) return false
    
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf[i]) * (11 - i)
    }
    let digit2 = 11 - (sum % 11)
    if (digit2 > 9) digit2 = 0
    
    return parseInt(cpf[10]) === digit2
  }
  
  static validateAmount(amount: number): boolean {
    return amount > 0 && amount <= 1000000 && Number.isFinite(amount)
  }
  
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('Senha deve ter pelo menos 8 caracteres')
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula')
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra minúscula')
    }
    
    if (!/\d/.test(password)) {
      errors.push('Senha deve conter pelo menos um número')
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Senha deve conter pelo menos um caractere especial')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Encryption utilities
export class EncryptionUtils {
  private static algorithm = 'aes-256-gcm'
  private static secretKey = process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-here'
  
  static encrypt(text: string): string {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher(this.algorithm, this.secretKey)
    
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    return iv.toString('hex') + ':' + encrypted
  }
  
  static decrypt(encryptedText: string): string {
    const [ivHex, encrypted] = encryptedText.split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipher(this.algorithm, this.secretKey)
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }
  
  static hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    return salt + ':' + hash
  }
  
  static verifyPassword(password: string, hashedPassword: string): boolean {
    const [salt, hash] = hashedPassword.split(':')
    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    return hash === verifyHash
  }
}
