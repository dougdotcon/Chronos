'use client'

import { motion } from 'framer-motion'
import { Bell, Settings, Filter, MarkAsRead } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotificationsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="notifications-header"
    >
      <div className="notifications-header-content">
        <div className="notifications-header-text">
          <h1 className="notifications-header-title">
            <Bell className="w-8 h-8 text-chronos-gold" />
            Notificações
          </h1>
          <p className="notifications-header-subtitle">
            Acompanhe todas as atualizações dos seus sorteios, depósitos e prêmios
          </p>
        </div>

        <div className="notifications-header-actions">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
          
          <Button variant="outline" size="sm">
            <MarkAsRead className="w-4 h-4 mr-2" />
            Marcar Todas como Lidas
          </Button>
          
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="notifications-stats"
      >
        <div className="notification-stat">
          <span className="notification-stat-number">12</span>
          <span className="notification-stat-label">Não lidas</span>
        </div>
        <div className="notification-stat">
          <span className="notification-stat-number">45</span>
          <span className="notification-stat-label">Esta semana</span>
        </div>
        <div className="notification-stat">
          <span className="notification-stat-number">3</span>
          <span className="notification-stat-label">Importantes</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
