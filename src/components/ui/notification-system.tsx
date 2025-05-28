'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Info,
  X,
  Trophy,
  DollarSign
} from 'lucide-react'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info' | 'prize'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationSystemProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5" />
    case 'error':
      return <XCircle className="w-5 h-5" />
    case 'warning':
      return <AlertCircle className="w-5 h-5" />
    case 'prize':
      return <Trophy className="w-5 h-5" />
    default:
      return <Info className="w-5 h-5" />
  }
}

const getNotificationStyles = (type: string) => {
  switch (type) {
    case 'success':
      return 'notification-success'
    case 'error':
      return 'notification-error'
    case 'warning':
      return 'notification-warning'
    case 'prize':
      return 'notification-prize'
    default:
      return 'notification-info'
  }
}

export function NotificationSystem({ notifications, onRemove }: NotificationSystemProps) {
  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          onRemove(notification.id)
        }, notification.duration)

        return () => clearTimeout(timer)
      }
    })
  }, [notifications, onRemove])

  return (
    <div className="notification-container">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`notification ${getNotificationStyles(notification.type)}`}
          >
            <div className="notification-content">
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="notification-text">
                <h4 className="notification-title">
                  {notification.title}
                </h4>
                <p className="notification-message">
                  {notification.message}
                </p>
                
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className="notification-action"
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => onRemove(notification.id)}
              className="notification-close"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook para gerenciar notificações
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000
    }
    
    setNotifications(prev => [...prev, newNotification])
    return id
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  // Notificações pré-definidas
  const notifySuccess = (title: string, message: string, action?: Notification['action']) => {
    return addNotification({ type: 'success', title, message, action })
  }

  const notifyError = (title: string, message: string, action?: Notification['action']) => {
    return addNotification({ type: 'error', title, message, duration: 8000, action })
  }

  const notifyWarning = (title: string, message: string, action?: Notification['action']) => {
    return addNotification({ type: 'warning', title, message, duration: 6000, action })
  }

  const notifyInfo = (title: string, message: string, action?: Notification['action']) => {
    return addNotification({ type: 'info', title, message, action })
  }

  const notifyPrize = (title: string, message: string, action?: Notification['action']) => {
    return addNotification({ type: 'prize', title, message, duration: 10000, action })
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    notifyPrize
  }
}
