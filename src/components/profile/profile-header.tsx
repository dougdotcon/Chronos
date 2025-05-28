'use client'

import { motion } from 'framer-motion'
import { User } from 'next-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  User as UserIcon,
  Camera,
  Shield,
  Star,
  Trophy,
  Calendar
} from 'lucide-react'
import { getInitials, formatRelativeTime } from '@/lib/utils'
import { AvatarUpload } from './avatar-upload'

interface ProfileHeaderProps {
  user: User
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  // Mock user data - em produção viria da API
  const userStats = {
    memberSince: new Date('2024-01-15'),
    totalSweepstakes: 47,
    totalWins: 3,
    winRate: 6.4,
    totalEarnings: 33535.75,
    verificationLevel: 'verified',
    accountType: 'premium'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="profile-header"
    >
      <div className="profile-header-content">
        <div className="profile-header-main">
          {/* Avatar Section */}
          <div className="profile-avatar-section">
            <AvatarUpload user={user} />

            <div className="profile-verification-badges">
              {userStats.verificationLevel === 'verified' && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Shield className="w-3 h-3 mr-1" />
                  Verificado
                </Badge>
              )}

              {userStats.accountType === 'premium' && (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  <Star className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="profile-user-info">
            <h1 className="profile-user-name">
              {user.name || 'Usuário'}
            </h1>
            <p className="profile-user-email">
              {user.email}
            </p>

            <div className="profile-user-meta">
              <div className="profile-meta-item">
                <Calendar className="w-4 h-4" />
                <span>Membro desde {formatRelativeTime(userStats.memberSince)}</span>
              </div>

              <div className="profile-meta-item">
                <Trophy className="w-4 h-4" />
                <span>{userStats.totalWins} vitórias em {userStats.totalSweepstakes} sorteios</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="profile-stats-grid">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="profile-stat-card"
          >
            <div className="profile-stat-icon">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="profile-stat-content">
              <span className="profile-stat-value">{userStats.totalWins}</span>
              <span className="profile-stat-label">Vitórias</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="profile-stat-card"
          >
            <div className="profile-stat-icon">
              <UserIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div className="profile-stat-content">
              <span className="profile-stat-value">{userStats.totalSweepstakes}</span>
              <span className="profile-stat-label">Participações</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="profile-stat-card"
          >
            <div className="profile-stat-icon">
              <Star className="w-5 h-5 text-purple-400" />
            </div>
            <div className="profile-stat-content">
              <span className="profile-stat-value">{userStats.winRate}%</span>
              <span className="profile-stat-label">Taxa de Vitória</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="profile-stat-card"
          >
            <div className="profile-stat-icon">
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            <div className="profile-stat-content">
              <span className="profile-stat-value">R$ {userStats.totalEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <span className="profile-stat-label">Total Ganho</span>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="profile-quick-actions"
        >
          <Button variant="outline" size="sm">
            Editar Perfil
          </Button>

          <Button variant="outline" size="sm">
            Configurações de Segurança
          </Button>

          <Button variant="outline" size="sm">
            Verificar Identidade
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
