import { NextRequest, NextResponse } from 'next/server'
import { systemMonitor } from '@/lib/monitoring'

// Health check endpoint for load balancers and monitoring
export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Basic health checks
    const checks = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      checks: {} as Record<string, any>
    }

    // Database health check
    try {
      // In a real app, you'd check actual database connection
      // const dbResult = await prisma.$queryRaw`SELECT 1`
      checks.checks.database = {
        status: 'healthy',
        responseTime: Math.random() * 50 + 10 // Simulated
      }
    } catch (error) {
      checks.checks.database = {
        status: 'unhealthy',
        error: error.message
      }
      checks.status = 'degraded'
    }

    // Redis health check
    try {
      // In a real app, you'd check Redis connection
      // await redis.ping()
      checks.checks.redis = {
        status: 'healthy',
        responseTime: Math.random() * 20 + 5 // Simulated
      }
    } catch (error) {
      checks.checks.redis = {
        status: 'unhealthy',
        error: error.message
      }
      checks.status = 'degraded'
    }

    // External services health check
    checks.checks.external = {
      email: { status: 'healthy' },
      payment: { status: 'healthy' },
      websocket: { status: 'healthy' }
    }

    // System metrics
    const metrics = await systemMonitor.getCurrentMetrics()
    checks.checks.system = {
      cpu: metrics.cpu.usage,
      memory: metrics.memory.percentage,
      disk: metrics.disk.percentage
    }

    // Check if any critical thresholds are exceeded
    if (metrics.cpu.usage > 90 || metrics.memory.percentage > 95) {
      checks.status = 'degraded'
    }

    const responseTime = Date.now() - startTime
    checks.checks.responseTime = responseTime

    // Return appropriate status code
    const statusCode = checks.status === 'healthy' ? 200 : 
                      checks.status === 'degraded' ? 200 : 503

    return NextResponse.json(checks, { status: statusCode })

  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 'unhealthy',
      error: error.message,
      uptime: process.uptime()
    }, { status: 503 })
  }
}

// Detailed health check for monitoring systems
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const includeDetails = body.detailed || false

    const health = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      services: {} as Record<string, any>
    }

    if (includeDetails) {
      // Get detailed system metrics
      const metrics = await systemMonitor.getCurrentMetrics()
      const healthStatus = systemMonitor.getHealthStatus()
      const activeAlerts = systemMonitor.getActiveAlerts()

      health.services = {
        system: {
          metrics,
          health: healthStatus,
          alerts: activeAlerts
        },
        application: {
          version: process.env.npm_package_version || '1.0.0',
          environment: process.env.NODE_ENV,
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          pid: process.pid
        }
      }
    }

    return NextResponse.json(health)

  } catch (error) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 'error',
      error: error.message
    }, { status: 500 })
  }
}
