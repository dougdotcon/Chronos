'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Trophy, 
  DollarSign, 
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Gift,
  Users,
  Clock
} from 'lucide-react'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'

interface NotificationsListProps {
  userId: string
}

interface Notification {
  id: string
  type: 'prize' | 'deposit' | 'sweepstake' | 'system' | 'bonus'
  title: string
  message: string
  isRead: boolean
  isImportant: boolean
  createdAt: Date
  data?: any
}

// Mock data - em produção viria da API
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'prize',
    title: '🎉 Parabéns! Você ganhou!',
    message: 'Você foi o vencedor do sorteio "Mega Noturno #1247" e ganhou R$ 23.750,00!',
    isRead: false,
    isImportant: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    data: { sweepstakeId: 'sweep_001', prize: 23750 }
  },
  {
    id: '2',
    type: 'deposit',
    title: 'Depósito confirmado',
    message: 'Seu depósito de R$ 100,00 via PIX foi processado com sucesso.',
    isRead: false,
    isImportant: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    data: { amount: 100, method: 'PIX' }
  },
  {
    id: '3',
    type: 'sweepstake',
    title: 'Sorteio iniciado',
    message: 'O sorteio "Duelo X1 Relâmpago #892" que você participa começou!',
    isRead: true,
    isImportant: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    data: { sweepstakeId: 'sweep_002' }
  },
  {
    id: '4',
    type: 'bonus',
    title: 'Bônus de boas-vindas',
    message: 'Bem-vindo ao Chronos! Você recebeu R$ 100,00 de bônus para começar.',
    isRead: true,
    isImportant: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    data: { amount: 100 }
  },
  {
    id: '5',
    type: 'system',
    title: 'Manutenção programada',
    message: 'Haverá uma breve manutenção no sistema amanhã às 02:00.',
    isRead: false,
    isImportant: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    data: { scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 18) }
  }
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'prize':
      return <Trophy className="w-5 h-5" />
    case 'deposit':
      return <DollarSign className="w-5 h-5" />
    case 'sweepstake':
      return <Users className="w-5 h-5" />
    case 'bonus':
      return <Gift className="w-5 h-5" />
    case 'system':
      return <Info className="w-5 h-5" />
    default:
      return <Bell className="w-5 h-5" />
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'prize':
      return 'text-yellow-400'
    case 'deposit':
      return 'text-green-400'
    case 'sweepstake':
      return 'text-blue-400'
    case 'bonus':
      return 'text-purple-400'
    case 'system':
      return 'text-orange-400'
    default:
      return 'text-gray-400'
  }
}

export function NotificationsList({ userId }: NotificationsListProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all')

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead
    if (filter === 'important') return notification.isImportant
    return true
  })

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Card className="notifications-list-card">
        <CardContent className="notifications-list-content">
          {/* Filters */}
          <div className="notifications-filters">
            <button
              onClick={() => setFilter('all')}
              className={`notification-filter ${filter === 'all' ? 'active' : ''}`}
            >
              Todas ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`notification-filter ${filter === 'unread' ? 'active' : ''}`}
            >
              Não lidas ({notifications.filter(n => !n.isRead).length})
            </button>
            <button
              onClick={() => setFilter('important')}
              className={`notification-filter ${filter === 'important' ? 'active' : ''}`}
            >
              Importantes ({notifications.filter(n => n.isImportant).length})
            </button>
          </div>

          {/* Notifications */}
          <div className="notifications-list">
            {filteredNotifications.length === 0 ? (
              <div className="notifications-empty">
                <Bell className="notifications-empty-icon" />
                <h3>Nenhuma notificação</h3>
                <p>Você está em dia com todas as suas notificações!</p>
              </div>
            ) : (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-item-content">
                    <div className={`notification-item-icon ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="notification-item-text">
                      <div className="notification-item-header">
                        <h4 className="notification-item-title">
                          {notification.title}
                        </h4>
                        <div className="notification-item-meta">
                          {notification.isImportant && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Importante
                            </Badge>
                          )}
                          <span className="notification-item-time">
                            <Clock className="w-3 h-3" />
                            {formatRelativeTime(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="notification-item-message">
                        {notification.message}
                      </p>

                      {/* Action buttons based on type */}
                      {notification.type === 'prize' && notification.data && (
                        <div className="notification-item-actions">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/sweepstakes/${notification.data.sweepstakeId}`}>
                              Ver Sorteio
                            </Link>
                          </Button>
                        </div>
                      )}

                      {notification.type === 'sweepstake' && notification.data && (
                        <div className="notification-item-actions">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/sweepstakes/${notification.data.sweepstakeId}`}>
                              Ir para Sala
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {!notification.isRead && (
                    <div className="notification-unread-indicator" />
                  )}
                </motion.div>
              ))
            )}
          </div>

          {/* Load More */}
          {filteredNotifications.length > 0 && (
            <div className="notifications-load-more">
              <Button variant="outline" size="sm">
                Carregar Mais Notificações
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
