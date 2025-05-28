'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  LogIn,
  LogOut,
  Trophy,
  DollarSign,
  Users,
  Settings,
  Eye,
  Bell,
  Shield,
  Clock
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

interface ActivityHistoryProps {
  userId: string
}

interface ActivityItem {
  id: string
  type: 'login' | 'logout' | 'sweepstake_join' | 'sweepstake_win' | 'deposit' | 'withdrawal' | 'settings_change' | 'view_audit' | 'notification_read'
  title: string
  description: string
  timestamp: Date
  metadata?: any
  importance: 'low' | 'medium' | 'high'
}

// Mock data
const mockActivities: ActivityItem[] = [
  {
    id: 'act_001',
    type: 'sweepstake_win',
    title: 'Vitória em sorteio!',
    description: 'Você ganhou R$ 23.750,00 no sorteio "Mega Noturno #1247"',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    metadata: { sweepstakeId: 'sweep_001', amount: 23750 },
    importance: 'high'
  },
  {
    id: 'act_002',
    type: 'login',
    title: 'Login realizado',
    description: 'Você fez login na plataforma',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    metadata: { ip: '192.168.1.1', device: 'Chrome/Windows' },
    importance: 'low'
  },
  {
    id: 'act_003',
    type: 'deposit',
    title: 'Depósito confirmado',
    description: 'Depósito de R$ 100,00 via PIX processado com sucesso',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    metadata: { amount: 100, method: 'PIX' },
    importance: 'medium'
  },
  {
    id: 'act_004',
    type: 'sweepstake_join',
    title: 'Participação em sorteio',
    description: 'Você entrou no sorteio "Mega Noturno #1247"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    metadata: { sweepstakeId: 'sweep_001', entryFee: 1.50 },
    importance: 'medium'
  },
  {
    id: 'act_005',
    type: 'view_audit',
    title: 'Auditoria consultada',
    description: 'Você visualizou a página de auditoria pública',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    metadata: { page: '/audit' },
    importance: 'low'
  },
  {
    id: 'act_006',
    type: 'settings_change',
    title: 'Configurações alteradas',
    description: 'Você atualizou suas preferências de notificação',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    metadata: { section: 'notifications' },
    importance: 'low'
  },
  {
    id: 'act_007',
    type: 'sweepstake_join',
    title: 'Participação em sorteio',
    description: 'Você entrou no sorteio "Duelo X1 #892"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    metadata: { sweepstakeId: 'sweep_002', entryFee: 450 },
    importance: 'medium'
  },
  {
    id: 'act_008',
    type: 'notification_read',
    title: 'Notificações lidas',
    description: 'Você marcou 5 notificações como lidas',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    metadata: { count: 5 },
    importance: 'low'
  }
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'login':
      return <LogIn className="w-4 h-4" />
    case 'logout':
      return <LogOut className="w-4 h-4" />
    case 'sweepstake_join':
    case 'sweepstake_win':
      return <Trophy className="w-4 h-4" />
    case 'deposit':
    case 'withdrawal':
      return <DollarSign className="w-4 h-4" />
    case 'settings_change':
      return <Settings className="w-4 h-4" />
    case 'view_audit':
      return <Eye className="w-4 h-4" />
    case 'notification_read':
      return <Bell className="w-4 h-4" />
    default:
      return <Activity className="w-4 h-4" />
  }
}

const getActivityColor = (type: string, importance: string) => {
  if (importance === 'high') return 'text-yellow-400'
  if (importance === 'medium') return 'text-blue-400'
  
  switch (type) {
    case 'sweepstake_win':
      return 'text-yellow-400'
    case 'deposit':
      return 'text-green-400'
    case 'sweepstake_join':
      return 'text-blue-400'
    case 'login':
    case 'logout':
      return 'text-purple-400'
    default:
      return 'text-gray-400'
  }
}

const getImportanceBadge = (importance: string) => {
  switch (importance) {
    case 'high':
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          <Shield className="w-3 h-3 mr-1" />
          Importante
        </Badge>
      )
    case 'medium':
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          Relevante
        </Badge>
      )
    default:
      return null
  }
}

export function ActivityHistory({ userId }: ActivityHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  const filteredActivities = mockActivities.filter(activity => {
    if (filter === 'all') return true
    return activity.importance === filter
  })

  const todayActivities = mockActivities.filter(
    activity => activity.timestamp > new Date(Date.now() - 1000 * 60 * 60 * 24)
  ).length

  const weekActivities = mockActivities.filter(
    activity => activity.timestamp > new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
  ).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="activity-history"
    >
      {/* Summary */}
      <div className="activity-history-summary">
        <div className="summary-stat">
          <span className="summary-stat-value">
            {todayActivities}
          </span>
          <span className="summary-stat-label">Hoje</span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat-value">
            {weekActivities}
          </span>
          <span className="summary-stat-label">Esta semana</span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat-value">
            {mockActivities.length}
          </span>
          <span className="summary-stat-label">Total</span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat-value">
            {mockActivities.filter(a => a.importance === 'high').length}
          </span>
          <span className="summary-stat-label">Importantes</span>
        </div>
      </div>

      {/* Filters */}
      <div className="activity-history-filters">
        <button
          onClick={() => setFilter('all')}
          className={`history-filter ${filter === 'all' ? 'active' : ''}`}
        >
          Todas ({mockActivities.length})
        </button>
        <button
          onClick={() => setFilter('high')}
          className={`history-filter ${filter === 'high' ? 'active' : ''}`}
        >
          Importantes ({mockActivities.filter(a => a.importance === 'high').length})
        </button>
        <button
          onClick={() => setFilter('medium')}
          className={`history-filter ${filter === 'medium' ? 'active' : ''}`}
        >
          Relevantes ({mockActivities.filter(a => a.importance === 'medium').length})
        </button>
        <button
          onClick={() => setFilter('low')}
          className={`history-filter ${filter === 'low' ? 'active' : ''}`}
        >
          Outras ({mockActivities.filter(a => a.importance === 'low').length})
        </button>
      </div>

      {/* Timeline */}
      <div className="activity-history-timeline">
        {filteredActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="activity-timeline-item"
          >
            <div className="activity-timeline-marker">
              <div className={`activity-timeline-icon ${getActivityColor(activity.type, activity.importance)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="activity-timeline-line" />
            </div>

            <Card className={`activity-timeline-content ${activity.importance}`}>
              <CardContent className="activity-timeline-card-content">
                <div className="activity-timeline-header">
                  <div className="activity-timeline-info">
                    <h3 className="activity-timeline-title">
                      {activity.title}
                    </h3>
                    <p className="activity-timeline-description">
                      {activity.description}
                    </p>
                  </div>
                  
                  <div className="activity-timeline-meta">
                    {getImportanceBadge(activity.importance)}
                    <span className="activity-timeline-time">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                </div>

                {activity.metadata && (
                  <div className="activity-timeline-metadata">
                    {activity.type === 'login' && activity.metadata.device && (
                      <span className="activity-metadata-item">
                        Dispositivo: {activity.metadata.device}
                      </span>
                    )}
                    {activity.metadata.amount && (
                      <span className="activity-metadata-item">
                        Valor: R$ {activity.metadata.amount.toFixed(2)}
                      </span>
                    )}
                    {activity.metadata.method && (
                      <span className="activity-metadata-item">
                        Método: {activity.metadata.method}
                      </span>
                    )}
                    {activity.metadata.sweepstakeId && (
                      <span className="activity-metadata-item">
                        ID: #{activity.metadata.sweepstakeId}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <div className="activity-history-load-more">
        <Button variant="outline">
          Carregar Mais Atividades
        </Button>
      </div>
    </motion.div>
  )
}
