'use client'

import { motion } from 'framer-motion'
import { User } from 'next-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getInitials } from '@/lib/utils'

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="dashboard-header"
    >
      <div className="dashboard-header-content">
        <div className="dashboard-header-user">
          <Avatar className="dashboard-avatar">
            <AvatarImage src={user.image || ''} alt={user.name || ''} />
            <AvatarFallback className="dashboard-avatar-fallback">
              {getInitials(user.name || 'U')}
            </AvatarFallback>
          </Avatar>
          
          <div className="dashboard-header-info">
            <h1 className="dashboard-greeting">
              {getGreeting()}, <span className="dashboard-username">{user.name}</span>!
            </h1>
            <p className="dashboard-subtitle">
              Bem-vindo ao seu painel Chronos
            </p>
          </div>
        </div>

        <div className="dashboard-header-badges">
          <Badge variant="outline" className="dashboard-badge">
            🎯 Membro Ativo
          </Badge>
          {user.nickname && (
            <Badge variant="outline" className="dashboard-badge dashboard-badge-nickname">
              @{user.nickname}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  )
}
