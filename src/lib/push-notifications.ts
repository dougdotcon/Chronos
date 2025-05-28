// Push notifications service
export interface PushNotification {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  data?: Record<string, any>
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
  tag?: string
  requireInteraction?: boolean
  silent?: boolean
  vibrate?: number[]
}

export interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null
  private subscription: globalThis.PushSubscription | null = null

  // Initialize push notifications
  async initialize(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported')
      return false
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered for push notifications')

      // Check if already subscribed
      this.subscription = await this.registration.pushManager.getSubscription()
      
      return true
    } catch (error) {
      console.error('Failed to initialize push notifications:', error)
      return false
    }
  }

  // Request permission for push notifications
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported')
      return 'denied'
    }

    let permission = Notification.permission

    if (permission === 'default') {
      permission = await Notification.requestPermission()
    }

    return permission
  }

  // Subscribe to push notifications
  async subscribe(): Promise<PushSubscription | null> {
    if (!this.registration) {
      console.error('Service worker not registered')
      return null
    }

    const permission = await this.requestPermission()
    if (permission !== 'granted') {
      console.warn('Push notification permission denied')
      return null
    }

    try {
      // VAPID public key (in production, this should come from environment)
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 
        'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9f8HnKJuOmLWjMpS_7VnYkYdYWjZfHivDJyhnOJAhBrlAqYdVAJw'

      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
      })

      // Send subscription to server
      await this.sendSubscriptionToServer(this.subscription)

      console.log('Push notification subscription successful')
      return this.serializeSubscription(this.subscription)
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      return null
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe(): Promise<boolean> {
    if (!this.subscription) {
      return true
    }

    try {
      await this.subscription.unsubscribe()
      await this.removeSubscriptionFromServer()
      this.subscription = null
      console.log('Push notification unsubscription successful')
      return true
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
      return false
    }
  }

  // Check if subscribed
  isSubscribed(): boolean {
    return this.subscription !== null
  }

  // Get current subscription
  getSubscription(): PushSubscription | null {
    if (!this.subscription) return null
    return this.serializeSubscription(this.subscription)
  }

  // Show local notification
  async showNotification(notification: PushNotification): Promise<void> {
    if (!this.registration) {
      console.error('Service worker not registered')
      return
    }

    const permission = await this.requestPermission()
    if (permission !== 'granted') {
      console.warn('Notification permission denied')
      return
    }

    try {
      await this.registration.showNotification(notification.title, {
        body: notification.body,
        icon: notification.icon || '/icons/icon-192x192.png',
        badge: notification.badge || '/icons/badge-72x72.png',
        image: notification.image,
        data: notification.data,
        actions: notification.actions,
        tag: notification.tag,
        requireInteraction: notification.requireInteraction || false,
        silent: notification.silent || false,
        vibrate: notification.vibrate || [200, 100, 200]
      })
    } catch (error) {
      console.error('Failed to show notification:', error)
    }
  }

  // Send test notification
  async sendTestNotification(): Promise<void> {
    await this.showNotification({
      title: 'Chronos Platform',
      body: 'Notificações push estão funcionando!',
      icon: '/icons/icon-192x192.png',
      data: { type: 'test' },
      actions: [
        {
          action: 'view',
          title: 'Ver Dashboard'
        },
        {
          action: 'dismiss',
          title: 'Dispensar'
        }
      ]
    })
  }

  // Predefined notification types
  async notifySweepstakeWin(sweepstakeId: string, amount: number): Promise<void> {
    await this.showNotification({
      title: '🎉 Parabéns! Você ganhou!',
      body: `Você ganhou R$ ${amount.toFixed(2)} no sorteio!`,
      icon: '/icons/trophy.png',
      data: { 
        type: 'sweepstake_win',
        sweepstakeId,
        amount 
      },
      actions: [
        {
          action: 'view_sweepstake',
          title: 'Ver Sorteio'
        },
        {
          action: 'view_balance',
          title: 'Ver Saldo'
        }
      ],
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 200]
    })
  }

  async notifyDepositConfirmed(amount: number): Promise<void> {
    await this.showNotification({
      title: '💰 Depósito Confirmado',
      body: `Seu depósito de R$ ${amount.toFixed(2)} foi confirmado!`,
      icon: '/icons/money.png',
      data: { 
        type: 'deposit_confirmed',
        amount 
      },
      actions: [
        {
          action: 'view_balance',
          title: 'Ver Saldo'
        }
      ]
    })
  }

  async notifyWithdrawalProcessed(amount: number): Promise<void> {
    await this.showNotification({
      title: '🏦 Saque Processado',
      body: `Seu saque de R$ ${amount.toFixed(2)} foi processado!`,
      icon: '/icons/bank.png',
      data: { 
        type: 'withdrawal_processed',
        amount 
      }
    })
  }

  async notifySweepstakeStarting(sweepstakeId: string, title: string): Promise<void> {
    await this.showNotification({
      title: '🎯 Sorteio Começando',
      body: `O sorteio "${title}" está começando!`,
      icon: '/icons/dice.png',
      data: { 
        type: 'sweepstake_starting',
        sweepstakeId 
      },
      actions: [
        {
          action: 'join_sweepstake',
          title: 'Participar'
        },
        {
          action: 'view_sweepstake',
          title: 'Ver Detalhes'
        }
      ]
    })
  }

  // Private helper methods
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  private serializeSubscription(subscription: globalThis.PushSubscription): PushSubscription {
    const key = subscription.getKey('p256dh')
    const auth = subscription.getKey('auth')

    return {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: key ? btoa(String.fromCharCode(...new Uint8Array(key))) : '',
        auth: auth ? btoa(String.fromCharCode(...new Uint8Array(auth))) : ''
      }
    }
  }

  private async sendSubscriptionToServer(subscription: globalThis.PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.serializeSubscription(subscription))
      })

      if (!response.ok) {
        throw new Error('Failed to send subscription to server')
      }
    } catch (error) {
      console.error('Error sending subscription to server:', error)
    }
  }

  private async removeSubscriptionFromServer(): Promise<void> {
    try {
      const response = await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to remove subscription from server')
      }
    } catch (error) {
      console.error('Error removing subscription from server:', error)
    }
  }
}

// Export singleton instance
export const pushNotificationService = new PushNotificationService()

// React hook for push notifications
export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    const initializePush = async () => {
      const supported = await pushNotificationService.initialize()
      setIsSupported(supported)
      
      if (supported) {
        setIsSubscribed(pushNotificationService.isSubscribed())
        setPermission(Notification.permission)
      }
    }

    initializePush()
  }, [])

  const subscribe = async () => {
    const subscription = await pushNotificationService.subscribe()
    setIsSubscribed(subscription !== null)
    setPermission(Notification.permission)
    return subscription
  }

  const unsubscribe = async () => {
    const success = await pushNotificationService.unsubscribe()
    if (success) {
      setIsSubscribed(false)
    }
    return success
  }

  const sendTestNotification = async () => {
    await pushNotificationService.sendTestNotification()
  }

  return {
    isSupported,
    isSubscribed,
    permission,
    subscribe,
    unsubscribe,
    sendTestNotification
  }
}
