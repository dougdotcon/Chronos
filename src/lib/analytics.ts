// Analytics and metrics tracking system
export interface AnalyticsEvent {
  event: string
  userId?: string
  sessionId?: string
  properties?: Record<string, any>
  timestamp: number
  page?: string
  userAgent?: string
  ip?: string
}

export interface BusinessMetrics {
  revenue: {
    total: number
    daily: number
    monthly: number
    growth: number
  }
  users: {
    total: number
    active: number
    new: number
    retention: number
  }
  sweepstakes: {
    total: number
    active: number
    completed: number
    averageParticipants: number
  }
  conversion: {
    signupToDeposit: number
    depositToSweepstake: number
    sweepstakeToWithdrawal: number
  }
}

// In-memory storage for development (use database in production)
const analyticsStore: AnalyticsEvent[] = []
const metricsCache = new Map<string, { data: any; timestamp: number }>()

export class Analytics {
  // Track user events
  static track(event: string, properties?: Record<string, any>, userId?: string): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      userId,
      sessionId: this.getSessionId(),
      properties: properties || {},
      timestamp: Date.now(),
      page: typeof window !== 'undefined' ? window.location.pathname : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    }

    // Store event
    analyticsStore.push(analyticsEvent)

    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalyticsService(analyticsEvent)
    } else {
      console.log('📊 Analytics Event:', analyticsEvent)
    }

    // Update real-time metrics
    this.updateRealTimeMetrics(analyticsEvent)
  }

  // Common event tracking methods
  static trackPageView(page: string, userId?: string): void {
    this.track('page_view', { page }, userId)
  }

  static trackUserSignup(userId: string, method: string): void {
    this.track('user_signup', { method }, userId)
  }

  static trackUserLogin(userId: string, method: string): void {
    this.track('user_login', { method }, userId)
  }

  static trackDeposit(userId: string, amount: number, method: string): void {
    this.track('deposit', { amount, method }, userId)
  }

  static trackWithdrawal(userId: string, amount: number, method: string): void {
    this.track('withdrawal', { amount, method }, userId)
  }

  static trackSweepstakeJoin(userId: string, sweepstakeId: string, amount: number): void {
    this.track('sweepstake_join', { sweepstakeId, amount }, userId)
  }

  static trackSweepstakeWin(userId: string, sweepstakeId: string, amount: number): void {
    this.track('sweepstake_win', { sweepstakeId, amount }, userId)
  }

  static trackSweepstakeComplete(sweepstakeId: string, participants: number, prizeAmount: number): void {
    this.track('sweepstake_complete', { sweepstakeId, participants, prizeAmount })
  }

  static trackError(error: string, context?: Record<string, any>, userId?: string): void {
    this.track('error', { error, context }, userId)
  }

  // Get business metrics
  static async getBusinessMetrics(): Promise<BusinessMetrics> {
    const cacheKey = 'business_metrics'
    const cached = metricsCache.get(cacheKey)
    
    // Return cached data if less than 5 minutes old
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return cached.data
    }

    const metrics = await this.calculateBusinessMetrics()
    metricsCache.set(cacheKey, { data: metrics, timestamp: Date.now() })
    
    return metrics
  }

  // Calculate metrics from events
  private static async calculateBusinessMetrics(): Promise<BusinessMetrics> {
    const now = Date.now()
    const dayAgo = now - (24 * 60 * 60 * 1000)
    const monthAgo = now - (30 * 24 * 60 * 60 * 1000)

    // Filter events by time period
    const allEvents = analyticsStore
    const dailyEvents = allEvents.filter(e => e.timestamp > dayAgo)
    const monthlyEvents = allEvents.filter(e => e.timestamp > monthAgo)

    // Calculate revenue metrics
    const depositEvents = allEvents.filter(e => e.event === 'deposit')
    const dailyDeposits = dailyEvents.filter(e => e.event === 'deposit')
    const monthlyDeposits = monthlyEvents.filter(e => e.event === 'deposit')

    const totalRevenue = depositEvents.reduce((sum, e) => sum + (e.properties?.amount || 0), 0)
    const dailyRevenue = dailyDeposits.reduce((sum, e) => sum + (e.properties?.amount || 0), 0)
    const monthlyRevenue = monthlyDeposits.reduce((sum, e) => sum + (e.properties?.amount || 0), 0)

    // Calculate user metrics
    const signupEvents = allEvents.filter(e => e.event === 'user_signup')
    const loginEvents = allEvents.filter(e => e.event === 'user_login')
    const dailySignups = dailyEvents.filter(e => e.event === 'user_signup')
    
    const totalUsers = new Set(signupEvents.map(e => e.userId)).size
    const activeUsers = new Set(dailyEvents.map(e => e.userId).filter(Boolean)).size
    const newUsers = dailySignups.length

    // Calculate sweepstake metrics
    const sweepstakeJoins = allEvents.filter(e => e.event === 'sweepstake_join')
    const sweepstakeCompletes = allEvents.filter(e => e.event === 'sweepstake_complete')
    
    const totalSweepstakes = new Set(sweepstakeJoins.map(e => e.properties?.sweepstakeId)).size
    const completedSweepstakes = sweepstakeCompletes.length
    const averageParticipants = sweepstakeCompletes.length > 0 
      ? sweepstakeCompletes.reduce((sum, e) => sum + (e.properties?.participants || 0), 0) / sweepstakeCompletes.length
      : 0

    // Calculate conversion rates
    const usersWithDeposits = new Set(depositEvents.map(e => e.userId)).size
    const usersWithSweepstakes = new Set(sweepstakeJoins.map(e => e.userId)).size
    const withdrawalEvents = allEvents.filter(e => e.event === 'withdrawal')
    const usersWithWithdrawals = new Set(withdrawalEvents.map(e => e.userId)).size

    const signupToDeposit = totalUsers > 0 ? (usersWithDeposits / totalUsers) * 100 : 0
    const depositToSweepstake = usersWithDeposits > 0 ? (usersWithSweepstakes / usersWithDeposits) * 100 : 0
    const sweepstakeToWithdrawal = usersWithSweepstakes > 0 ? (usersWithWithdrawals / usersWithSweepstakes) * 100 : 0

    return {
      revenue: {
        total: totalRevenue,
        daily: dailyRevenue,
        monthly: monthlyRevenue,
        growth: monthlyRevenue > 0 ? ((dailyRevenue * 30) / monthlyRevenue - 1) * 100 : 0
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        new: newUsers,
        retention: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0
      },
      sweepstakes: {
        total: totalSweepstakes,
        active: totalSweepstakes - completedSweepstakes,
        completed: completedSweepstakes,
        averageParticipants
      },
      conversion: {
        signupToDeposit,
        depositToSweepstake,
        sweepstakeToWithdrawal
      }
    }
  }

  // Get user behavior analytics
  static getUserBehaviorAnalytics(userId: string): {
    totalEvents: number
    lastActivity: number
    favoriteActions: Array<{ action: string; count: number }>
    sessionDuration: number
    conversionFunnel: Record<string, boolean>
  } {
    const userEvents = analyticsStore.filter(e => e.userId === userId)
    
    if (userEvents.length === 0) {
      return {
        totalEvents: 0,
        lastActivity: 0,
        favoriteActions: [],
        sessionDuration: 0,
        conversionFunnel: {}
      }
    }

    // Calculate favorite actions
    const actionCounts = userEvents.reduce((acc, event) => {
      acc[event.event] = (acc[event.event] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const favoriteActions = Object.entries(actionCounts)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Calculate session duration (simplified)
    const firstEvent = Math.min(...userEvents.map(e => e.timestamp))
    const lastEvent = Math.max(...userEvents.map(e => e.timestamp))
    const sessionDuration = lastEvent - firstEvent

    // Conversion funnel
    const hasSignup = userEvents.some(e => e.event === 'user_signup')
    const hasDeposit = userEvents.some(e => e.event === 'deposit')
    const hasSweepstake = userEvents.some(e => e.event === 'sweepstake_join')
    const hasWithdrawal = userEvents.some(e => e.event === 'withdrawal')

    return {
      totalEvents: userEvents.length,
      lastActivity: lastEvent,
      favoriteActions,
      sessionDuration,
      conversionFunnel: {
        signup: hasSignup,
        deposit: hasDeposit,
        sweepstake: hasSweepstake,
        withdrawal: hasWithdrawal
      }
    }
  }

  // A/B Testing support
  static getABTestVariant(testName: string, userId: string): 'A' | 'B' {
    // Simple hash-based assignment for consistent results
    const hash = this.simpleHash(testName + userId)
    return hash % 2 === 0 ? 'A' : 'B'
  }

  static trackABTestConversion(testName: string, variant: 'A' | 'B', userId: string): void {
    this.track('ab_test_conversion', { testName, variant }, userId)
  }

  // Utility methods
  private static getSessionId(): string {
    if (typeof window !== 'undefined') {
      let sessionId = sessionStorage.getItem('analytics_session_id')
      if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        sessionStorage.setItem('analytics_session_id', sessionId)
      }
      return sessionId
    }
    return 'server_session_' + Date.now()
  }

  private static simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  private static sendToAnalyticsService(event: AnalyticsEvent): void {
    // In production, send to services like Google Analytics, Mixpanel, etc.
    // For now, just log
    console.log('📊 Sending to analytics service:', event)
  }

  private static updateRealTimeMetrics(event: AnalyticsEvent): void {
    // Update real-time dashboard metrics
    // This could trigger WebSocket updates to admin dashboard
    if (event.event === 'deposit' || event.event === 'withdrawal' || event.event === 'sweepstake_win') {
      // Trigger real-time update
      console.log('📊 Real-time metric update:', event)
    }
  }

  // Export data for analysis
  static exportAnalyticsData(startDate?: Date, endDate?: Date): AnalyticsEvent[] {
    let events = analyticsStore

    if (startDate) {
      events = events.filter(e => e.timestamp >= startDate.getTime())
    }

    if (endDate) {
      events = events.filter(e => e.timestamp <= endDate.getTime())
    }

    return events
  }

  // Clear old data (for maintenance)
  static clearOldData(daysToKeep: number = 90): number {
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000)
    const initialLength = analyticsStore.length
    
    // Remove old events
    for (let i = analyticsStore.length - 1; i >= 0; i--) {
      if (analyticsStore[i].timestamp < cutoffTime) {
        analyticsStore.splice(i, 1)
      }
    }

    const removedCount = initialLength - analyticsStore.length
    console.log(`📊 Cleaned up ${removedCount} old analytics events`)
    
    return removedCount
  }
}

// React hook for analytics
export function useAnalytics() {
  const track = (event: string, properties?: Record<string, any>) => {
    Analytics.track(event, properties)
  }

  const trackPageView = (page: string) => {
    Analytics.trackPageView(page)
  }

  return {
    track,
    trackPageView
  }
}
