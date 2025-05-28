'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  onClose: () => void
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const toastStyles = {
  success: 'border-green-500 bg-green-50 dark:bg-green-900/20',
  error: 'border-red-500 bg-red-50 dark:bg-red-900/20',
  warning: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20',
  info: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
}

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-orange-500',
  info: 'text-blue-500',
}

export function Toast({ type, title, message, onClose }: ToastProps) {
  const Icon = toastIcons[type]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300, scale: 0.3 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
        className={cn(
          'relative flex w-full max-w-sm items-start space-x-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm',
          toastStyles[type]
        )}
      >
        <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', iconStyles[type])} />
        
        <div className="flex-1 space-y-1">
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 flex-shrink-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </motion.div>
    </AnimatePresence>
  )
}
