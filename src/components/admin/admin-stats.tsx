'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  UserCheck,
  AlertCircle,
  Trophy,
  Target
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Mock data - em produção viria da API
const adminStats = {
  totalUsers: 1247,
  activeUsers: 892,
  newUsersToday: 34,
  totalRevenue: 125430.50,
  revenueToday: 4523.75,
  revenueGrowth: 12.5,
  activeSweepstakes: 23,
  completedSweepstakes: 1456,
  totalTransactions: 8934,
  pendingWithdrawals: 12,
  systemHealth: 99.8,
  serverLoad: 45
}

export function AdminStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="admin-stats"
    >
      <div className="admin-stats-grid">
        {/* Users Stats */}
        <Card className="admin-stat-card">
          <CardHeader className="admin-stat-header">
            <CardTitle className="admin-stat-title">
              <Users className="w-5 h-5 text-blue-500" />
              Usuários
            </CardTitle>
          </CardHeader>
          <CardContent className="admin-stat-content">
            <div className="admin-stat-main">
              <span className="admin-stat-number">{adminStats.totalUsers.toLocaleString()}</span>
              <span className="admin-stat-label">Total de Usuários</span>
            </div>
            <div className="admin-stat-details">
              <div className="admin-stat-detail">
                <UserCheck className="w-4 h-4 text-green-500" />
                <span>{adminStats.activeUsers} ativos</span>
              </div>
              <div className="admin-stat-detail">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span>+{adminStats.newUsersToday} hoje</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Stats */}
        <Card className="admin-stat-card">
          <CardHeader className="admin-stat-header">
            <CardTitle className="admin-stat-title">
              <DollarSign className="w-5 h-5 text-green-500" />
              Receita
            </CardTitle>
          </CardHeader>
          <CardContent className="admin-stat-content">
            <div className="admin-stat-main">
              <span className="admin-stat-number">{formatCurrency(adminStats.totalRevenue)}</span>
              <span className="admin-stat-label">Receita Total</span>
            </div>
            <div className="admin-stat-details">
              <div className="admin-stat-detail">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>{formatCurrency(adminStats.revenueToday)} hoje</span>
              </div>
              <div className="admin-stat-detail">
                <Activity className="w-4 h-4 text-purple-500" />
                <span>+{adminStats.revenueGrowth}% crescimento</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sweepstakes Stats */}
        <Card className="admin-stat-card">
          <CardHeader className="admin-stat-header">
            <CardTitle className="admin-stat-title">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Sorteios
            </CardTitle>
          </CardHeader>
          <CardContent className="admin-stat-content">
            <div className="admin-stat-main">
              <span className="admin-stat-number">{adminStats.activeSweepstakes}</span>
              <span className="admin-stat-label">Sorteios Ativos</span>
            </div>
            <div className="admin-stat-details">
              <div className="admin-stat-detail">
                <Target className="w-4 h-4 text-green-500" />
                <span>{adminStats.completedSweepstakes} concluídos</span>
              </div>
              <div className="admin-stat-detail">
                <Activity className="w-4 h-4 text-blue-500" />
                <span>{adminStats.totalTransactions} transações</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="admin-stat-card">
          <CardHeader className="admin-stat-header">
            <CardTitle className="admin-stat-title">
              <Activity className="w-5 h-5 text-purple-500" />
              Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="admin-stat-content">
            <div className="admin-stat-main">
              <span className="admin-stat-number">{adminStats.systemHealth}%</span>
              <span className="admin-stat-label">Uptime</span>
            </div>
            <div className="admin-stat-details">
              <div className="admin-stat-detail">
                <Activity className="w-4 h-4 text-green-500" />
                <span>{adminStats.serverLoad}% CPU</span>
              </div>
              <div className="admin-stat-detail">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span>{adminStats.pendingWithdrawals} saques pendentes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="admin-activity-card">
          <CardHeader>
            <CardTitle className="admin-activity-title">
              <Activity className="w-5 h-5 text-chronos-gold" />
              Atividade em Tempo Real
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="admin-activity-list">
              <div className="admin-activity-item">
                <div className="admin-activity-dot success" />
                <span className="admin-activity-text">
                  Usuário João Silva ganhou R$ 2.500 no Sorteio #1234
                </span>
                <span className="admin-activity-time">há 2 min</span>
              </div>
              
              <div className="admin-activity-item">
                <div className="admin-activity-dot info" />
                <span className="admin-activity-text">
                  Novo usuário Maria Santos se cadastrou
                </span>
                <span className="admin-activity-time">há 5 min</span>
              </div>
              
              <div className="admin-activity-item">
                <div className="admin-activity-dot warning" />
                <span className="admin-activity-text">
                  Saque de R$ 1.000 aguardando aprovação
                </span>
                <span className="admin-activity-time">há 8 min</span>
              </div>
              
              <div className="admin-activity-item">
                <div className="admin-activity-dot success" />
                <span className="admin-activity-text">
                  Sorteio #1235 iniciado com 15 participantes
                </span>
                <span className="admin-activity-time">há 12 min</span>
              </div>
              
              <div className="admin-activity-item">
                <div className="admin-activity-dot info" />
                <span className="admin-activity-text">
                  Depósito de R$ 500 via PIX processado
                </span>
                <span className="admin-activity-time">há 15 min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
