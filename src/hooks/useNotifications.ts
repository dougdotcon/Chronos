'use client'

import { useState, useEffect } from 'react'

interface NotificationOptions {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  requireInteraction?: boolean
  actions?: NotificationAction[]
}

interface UseNotificationsReturn {
  permission: NotificationPermission | null
  isSupported: boolean
  requestPermission: () => Promise<NotificationPermission>
  showNotification: (options: NotificationOptions) => Promise<Notification | null>
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void
}

export function useNotifications(): UseNotificationsReturn {
  const [permission, setPermission] = useState<NotificationPermission | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      return 'denied'
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return 'denied'
    }
  }

  const showNotification = async (options: NotificationOptions): Promise<Notification | null> => {
    if (!isSupported || permission !== 'granted') {
      // Fallback to toast notification
      showToast(options.body, 'info')
      return null
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        badge: options.badge || '/favicon.ico',
        tag: options.tag,
        requireInteraction: options.requireInteraction || false,
        actions: options.actions || []
      })

      // Auto close after 5 seconds if not requiring interaction
      if (!options.requireInteraction) {
        setTimeout(() => {
          notification.close()
        }, 5000)
      }

      return notification
    } catch (error) {
      console.error('Error showing notification:', error)
      showToast(options.body, 'error')
      return null
    }
  }

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    // Create toast element
    const toast = document.createElement('div')
    toast.className = `toast toast-${type}`
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon">
          ${getToastIcon(type)}
        </div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
          ×
        </button>
      </div>
    `

    // Add styles
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      background: ${getToastColor(type)};
      color: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      max-width: 400px;
      animation: slideIn 0.3s ease-out;
    `

    // Add to DOM
    document.body.appendChild(toast)

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.animation = 'slideOut 0.3s ease-in'
        setTimeout(() => {
          toast.remove()
        }, 300)
      }
    }, 5000)
  }

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    showToast
  }
}

function getToastIcon(type: string): string {
  switch (type) {
    case 'success':
      return '✅'
    case 'error':
      return '❌'
    case 'warning':
      return '⚠️'
    case 'info':
    default:
      return 'ℹ️'
  }
}

function getToastColor(type: string): string {
  switch (type) {
    case 'success':
      return '#10b981'
    case 'error':
      return '#ef4444'
    case 'warning':
      return '#f59e0b'
    case 'info':
    default:
      return '#3b82f6'
  }
}

// Add CSS animations to document head
if (typeof window !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .toast-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .toast-icon {
      font-size: 18px;
    }
    
    .toast-message {
      flex: 1;
      font-size: 14px;
      line-height: 1.4;
    }
    
    .toast-close {
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s;
    }
    
    .toast-close:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  `
  
  if (!document.head.querySelector('#toast-styles')) {
    style.id = 'toast-styles'
    document.head.appendChild(style)
  }
}
