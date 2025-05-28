'use client'

import { useChronosStore } from '@/store/chronos-store'
import { Toast } from '@/components/ui/toast'
import { useEffect } from 'react'

export function Toaster() {
  const { notifications, removeNotification } = useChronosStore((state) => ({
    notifications: state.notifications,
    removeNotification: state.removeNotification,
  }))

  useEffect(() => {
    // Auto-remove notifications after 5 seconds
    notifications.forEach((notification) => {
      const timeElapsed = Date.now() - notification.timestamp.getTime()
      if (timeElapsed < 5000) {
        setTimeout(() => {
          removeNotification(notification.id)
        }, 5000 - timeElapsed)
      }
    })
  }, [notifications, removeNotification])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}
