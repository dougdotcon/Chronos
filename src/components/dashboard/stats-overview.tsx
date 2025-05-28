'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, 
  Target, 
  Award, 
  Calendar,
  BarChart3
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface StatsOverviewProps {
  userId: string
}

// Mock data - em produção viria da API
const userStats = {
  totalWinnings: 2450.00,
  totalSpent: 890.50,
  winRate: 68.5,
  sweepstakesParticipated: 47,
  sweepstakesWon: 12,
  currentStreak: 3,
  bestStreak: 7,
  memberSince: '2024-01-15'
}

const statCards = [
  {
    title: 'Total Ganho',
    value: formatCurrency(userStats.totalWinnings),
    icon: TrendingUp,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    change: '+15.2%',
    changeType: 'positive' as const
  },
  {
    title: 'Taxa de Vitória',
    value: `${userStats.winRate}%`,
    icon: Target,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    change: '+2.1%',
    changeType: 'positive' as const
  },
  {
    title: 'Sorteios Ganhos',
    value: userStats.sweepstakesWon.toString(),
    icon: Award,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    change: '+3',
    changeType: 'positive' as const
  },
  {
    title: 'Sequência Atual',
    value: `${userStats.currentStreak} vitórias`,
    icon: Calendar,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    change: 'Ativo',
    changeType: 'neutral' as const
  }
]

export function StatsOverview({ userId }: StatsOverviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <Card className="stats-overview-card">
        <CardHeader className="stats-overview-header">
          <CardTitle className="stats-overview-title">
            <BarChart3 className="w-5 h-5 text-chronos-gold" />
            Suas Estatísticas
          </CardTitle>
        </CardHeader>

        <CardContent className="stats-overview-content">
          <div className="stats-grid">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="stat-card-small"
              >
                <div className="stat-card-header">
                  <div className={`stat-card-icon ${stat.bgColor}`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className={`stat-card-change ${
                    stat.changeType === 'positive' ? 'text-green-400' : 
                    stat.changeType === 'negative' ? 'text-red-400' : 
                    'text-gray-400'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                
                <div className="stat-card-content">
                  <h3 className="stat-card-value">
                    {stat.value}
                  </h3>
                  <p className="stat-card-title">
                    {stat.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Performance Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="performance-chart"
          >
            <h3 className="performance-chart-title">
              Performance dos Últimos 7 Dias
            </h3>
            <div className="chart-placeholder">
              <div className="chart-bars">
                {[65, 80, 45, 90, 75, 95, 70].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.8, delay: 1.2 + i * 0.1 }}
                    className="chart-bar"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="chart-labels">
                {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day) => (
                  <span key={day} className="chart-label">
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Additional Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="additional-stats"
          >
            <div className="additional-stat">
              <span className="additional-stat-label">Total Investido:</span>
              <span className="additional-stat-value">
                {formatCurrency(userStats.totalSpent)} Chronos
              </span>
            </div>
            <div className="additional-stat">
              <span className="additional-stat-label">Sorteios Participados:</span>
              <span className="additional-stat-value">
                {userStats.sweepstakesParticipated}
              </span>
            </div>
            <div className="additional-stat">
              <span className="additional-stat-label">Melhor Sequência:</span>
              <span className="additional-stat-value">
                {userStats.bestStreak} vitórias
              </span>
            </div>
            <div className="additional-stat">
              <span className="additional-stat-label">Membro desde:</span>
              <span className="additional-stat-value">
                {new Date(userStats.memberSince).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
