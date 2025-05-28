// System monitoring and health checks
export interface SystemMetrics {
  timestamp: number
  cpu: {
    usage: number // percentage
    loadAverage: number[]
  }
  memory: {
    used: number // bytes
    total: number // bytes
    percentage: number
  }
  disk: {
    used: number // bytes
    total: number // bytes
    percentage: number
  }
  network: {
    bytesIn: number
    bytesOut: number
  }
  database: {
    connections: number
    queryTime: number // ms
    status: 'healthy' | 'degraded' | 'down'
  }
  application: {
    uptime: number // seconds
    activeUsers: number
    requestsPerMinute: number
    errorRate: number // percentage
  }
}

export interface HealthCheck {
  service: string
  status: 'healthy' | 'degraded' | 'down'
  responseTime: number // ms
  lastCheck: number
  error?: string
  details?: Record<string, any>
}

export interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info'
  service: string
  message: string
  timestamp: number
  resolved: boolean
  resolvedAt?: number
}

// In-memory storage for development
const metricsHistory: SystemMetrics[] = []
const healthChecks = new Map<string, HealthCheck>()
const alerts: Alert[] = []
const alertThresholds = {
  cpu: 80, // percentage
  memory: 85, // percentage
  disk: 90, // percentage
  responseTime: 5000, // ms
  errorRate: 5 // percentage
}

export class SystemMonitor {
  private intervalId?: NodeJS.Timeout
  private isRunning = false

  // Start monitoring
  start(intervalMs: number = 30000): void {
    if (this.isRunning) {
      console.log('🔍 Monitor already running')
      return
    }

    this.isRunning = true
    console.log('🔍 Starting system monitor')

    const collectMetrics = async () => {
      try {
        const metrics = await this.collectSystemMetrics()
        metricsHistory.push(metrics)

        // Keep only last 1000 metrics (about 8 hours at 30s intervals)
        if (metricsHistory.length > 1000) {
          metricsHistory.shift()
        }

        // Check for alerts
        await this.checkAlerts(metrics)

        // Run health checks
        await this.runHealthChecks()

      } catch (error) {
        console.error('🔍 Error collecting metrics:', error)
      }
    }

    // Initial collection
    collectMetrics()

    // Set up interval
    this.intervalId = setInterval(collectMetrics, intervalMs)
  }

  // Stop monitoring
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }
    this.isRunning = false
    console.log('🔍 System monitor stopped')
  }

  // Get current system metrics
  async getCurrentMetrics(): Promise<SystemMetrics> {
    return this.collectSystemMetrics()
  }

  // Get metrics history
  getMetricsHistory(hours: number = 1): SystemMetrics[] {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000)
    return metricsHistory.filter(m => m.timestamp > cutoff)
  }

  // Get health status
  getHealthStatus(): Record<string, HealthCheck> {
    const status: Record<string, HealthCheck> = {}
    for (const [service, check] of healthChecks) {
      status[service] = check
    }
    return status
  }

  // Get active alerts
  getActiveAlerts(): Alert[] {
    return alerts.filter(a => !a.resolved)
  }

  // Get all alerts
  getAllAlerts(limit: number = 100): Alert[] {
    return alerts
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
  }

  // Resolve alert
  resolveAlert(alertId: string): boolean {
    const alert = alerts.find(a => a.id === alertId)
    if (alert && !alert.resolved) {
      alert.resolved = true
      alert.resolvedAt = Date.now()
      console.log('🔍 Alert resolved:', alertId)
      return true
    }
    return false
  }

  // Private methods
  private async collectSystemMetrics(): Promise<SystemMetrics> {
    const timestamp = Date.now()

    // In a real implementation, these would use actual system APIs
    // For simulation, we'll generate realistic mock data
    const metrics: SystemMetrics = {
      timestamp,
      cpu: {
        usage: this.randomBetween(10, 70),
        loadAverage: [
          this.randomBetween(0.1, 2.0),
          this.randomBetween(0.1, 2.0),
          this.randomBetween(0.1, 2.0)
        ]
      },
      memory: {
        used: this.randomBetween(2000000000, 6000000000), // 2-6 GB
        total: 8000000000, // 8 GB
        percentage: 0
      },
      disk: {
        used: this.randomBetween(50000000000, 80000000000), // 50-80 GB
        total: 100000000000, // 100 GB
        percentage: 0
      },
      network: {
        bytesIn: this.randomBetween(1000000, 10000000), // 1-10 MB
        bytesOut: this.randomBetween(1000000, 10000000)
      },
      database: {
        connections: this.randomBetween(5, 50),
        queryTime: this.randomBetween(10, 200),
        status: 'healthy'
      },
      application: {
        uptime: Math.floor(process.uptime()),
        activeUsers: this.randomBetween(50, 500),
        requestsPerMinute: this.randomBetween(100, 1000),
        errorRate: this.randomBetween(0, 3)
      }
    }

    // Calculate percentages
    metrics.memory.percentage = (metrics.memory.used / metrics.memory.total) * 100
    metrics.disk.percentage = (metrics.disk.used / metrics.disk.total) * 100

    return metrics
  }

  private async runHealthChecks(): Promise<void> {
    const services = [
      'database',
      'redis',
      'email',
      'payment_gateway',
      'websocket',
      'file_storage'
    ]

    for (const service of services) {
      try {
        const startTime = Date.now()
        const isHealthy = await this.checkServiceHealth(service)
        const responseTime = Date.now() - startTime

        const healthCheck: HealthCheck = {
          service,
          status: isHealthy ? 'healthy' : 'down',
          responseTime,
          lastCheck: Date.now()
        }

        if (!isHealthy) {
          healthCheck.error = `Service ${service} is not responding`
        }

        healthChecks.set(service, healthCheck)

      } catch (error) {
        healthChecks.set(service, {
          service,
          status: 'down',
          responseTime: 0,
          lastCheck: Date.now(),
          error: error.message
        })
      }
    }
  }

  private async checkServiceHealth(service: string): Promise<boolean> {
    // Simulate health checks
    switch (service) {
      case 'database':
        // In real implementation: try to execute a simple query
        return Math.random() > 0.05 // 95% uptime
      
      case 'redis':
        // In real implementation: try to ping Redis
        return Math.random() > 0.02 // 98% uptime
      
      case 'email':
        // In real implementation: check SMTP connection
        return Math.random() > 0.1 // 90% uptime
      
      case 'payment_gateway':
        // In real implementation: ping payment API
        return Math.random() > 0.05 // 95% uptime
      
      case 'websocket':
        // In real implementation: check WebSocket server
        return Math.random() > 0.03 // 97% uptime
      
      case 'file_storage':
        // In real implementation: test file upload/download
        return Math.random() > 0.02 // 98% uptime
      
      default:
        return true
    }
  }

  private async checkAlerts(metrics: SystemMetrics): Promise<void> {
    const alerts: Array<{ type: Alert['type']; service: string; message: string }> = []

    // CPU alerts
    if (metrics.cpu.usage > alertThresholds.cpu) {
      alerts.push({
        type: metrics.cpu.usage > 90 ? 'critical' : 'warning',
        service: 'system',
        message: `High CPU usage: ${metrics.cpu.usage.toFixed(1)}%`
      })
    }

    // Memory alerts
    if (metrics.memory.percentage > alertThresholds.memory) {
      alerts.push({
        type: metrics.memory.percentage > 95 ? 'critical' : 'warning',
        service: 'system',
        message: `High memory usage: ${metrics.memory.percentage.toFixed(1)}%`
      })
    }

    // Disk alerts
    if (metrics.disk.percentage > alertThresholds.disk) {
      alerts.push({
        type: metrics.disk.percentage > 95 ? 'critical' : 'warning',
        service: 'system',
        message: `High disk usage: ${metrics.disk.percentage.toFixed(1)}%`
      })
    }

    // Database alerts
    if (metrics.database.queryTime > alertThresholds.responseTime) {
      alerts.push({
        type: 'warning',
        service: 'database',
        message: `Slow database queries: ${metrics.database.queryTime}ms`
      })
    }

    // Application alerts
    if (metrics.application.errorRate > alertThresholds.errorRate) {
      alerts.push({
        type: metrics.application.errorRate > 10 ? 'critical' : 'warning',
        service: 'application',
        message: `High error rate: ${metrics.application.errorRate.toFixed(1)}%`
      })
    }

    // Create alert records
    for (const alertData of alerts) {
      this.createAlert(alertData.type, alertData.service, alertData.message)
    }
  }

  private createAlert(type: Alert['type'], service: string, message: string): void {
    // Check if similar alert already exists and is not resolved
    const existingAlert = alerts.find(a => 
      !a.resolved && 
      a.service === service && 
      a.message === message &&
      Date.now() - a.timestamp < 5 * 60 * 1000 // within last 5 minutes
    )

    if (existingAlert) {
      return // Don't create duplicate alerts
    }

    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      service,
      message,
      timestamp: Date.now(),
      resolved: false
    }

    alerts.push(alert)

    // Log alert
    console.log(`🚨 [${type.toUpperCase()}] ${service}: ${message}`)

    // In production, send to alerting system (Slack, email, etc.)
    this.sendAlert(alert)
  }

  private sendAlert(alert: Alert): void {
    // In production, integrate with alerting services
    if (alert.type === 'critical') {
      console.log('🚨 CRITICAL ALERT - would send immediate notification')
    }
  }

  private randomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static metrics = new Map<string, number[]>()

  static startTimer(operation: string): () => void {
    const startTime = Date.now()
    
    return () => {
      const duration = Date.now() - startTime
      this.recordMetric(operation, duration)
    }
  }

  static recordMetric(operation: string, value: number): void {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, [])
    }
    
    const values = this.metrics.get(operation)!
    values.push(value)
    
    // Keep only last 1000 measurements
    if (values.length > 1000) {
      values.shift()
    }
  }

  static getMetrics(operation: string): {
    count: number
    average: number
    min: number
    max: number
    p95: number
  } | null {
    const values = this.metrics.get(operation)
    if (!values || values.length === 0) {
      return null
    }

    const sorted = [...values].sort((a, b) => a - b)
    const count = values.length
    const sum = values.reduce((a, b) => a + b, 0)
    const average = sum / count
    const min = sorted[0]
    const max = sorted[sorted.length - 1]
    const p95Index = Math.floor(count * 0.95)
    const p95 = sorted[p95Index]

    return { count, average, min, max, p95 }
  }

  static getAllMetrics(): Record<string, any> {
    const result: Record<string, any> = {}
    
    for (const [operation, values] of this.metrics) {
      result[operation] = this.getMetrics(operation)
    }
    
    return result
  }
}

// Usage example for performance monitoring
export function withPerformanceMonitoring<T extends (...args: any[]) => any>(
  operation: string,
  fn: T
): T {
  return ((...args: any[]) => {
    const endTimer = PerformanceMonitor.startTimer(operation)
    
    try {
      const result = fn(...args)
      
      // Handle async functions
      if (result && typeof result.then === 'function') {
        return result.finally(() => endTimer())
      }
      
      endTimer()
      return result
    } catch (error) {
      endTimer()
      throw error
    }
  }) as T
}

// Global monitor instance
export const systemMonitor = new SystemMonitor()
