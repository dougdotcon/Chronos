'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Star,
  Zap
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface ProfileStatsProps {
  userId: string
}

// Mock data - em produção viria da API
const userStats = {
  totalSweepstakes: 47,
  totalWins: 3,
  totalLosses: 44,
  winRate: 6.4,
  totalInvested: 235.50,
  totalEarnings: 33535.75,
  netProfit: 33300.25,
  averageEntry: 5.01,
  biggestWin: 23750.00,
  currentStreak: 0,
  bestStreak: 1,
  favoriteTime: 'Noite',
  favoriteType: 'Mega Sorteios',
  monthlyStats: {
    sweepstakes: 12,
    wins: 1,
    earnings: 23750.00
  },
  achievements: [
    { id: 'first_win', name: 'Primeira Vitória', description: 'Ganhou seu primeiro sorteio', unlocked: true },
    { id: 'big_winner', name: 'Grande Vencedor', description: 'Ganhou mais de R$ 10.000', unlocked: true },
    { id: 'frequent_player', name: 'Jogador Frequente', description: 'Participou de 50+ sorteios', unlocked: false, progress: 94 },
    { id: 'lucky_streak', name: 'Sequência de Sorte', description: 'Ganhou 3 sorteios seguidos', unlocked: false, progress: 33 }
  ]
}

export function ProfileStats({ userId }: ProfileStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="profile-stats"
    >
      {/* Performance Card */}
      <Card className="profile-stats-card">
        <CardHeader className="profile-stats-header">
          <CardTitle className="profile-stats-title">
            <BarChart3 className="w-5 h-5 text-chronos-gold" />
            Performance
          </CardTitle>
        </CardHeader>

        <CardContent className="profile-stats-content">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <Trophy className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="stat-content">
                <span className="stat-value">{userStats.totalWins}</span>
                <span className="stat-label">Vitórias</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <Target className="w-4 h-4 text-blue-400" />
              </div>
              <div className="stat-content">
                <span className="stat-value">{userStats.winRate}%</span>
                <span className="stat-label">Taxa de Vitória</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <div className="stat-content">
                <span className="stat-value">{formatCurrency(userStats.netProfit)}</span>
                <span className="stat-label">Lucro Líquido</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <div className="stat-content">
                <span className="stat-value">{userStats.currentStreak}</span>
                <span className="stat-label">Sequência Atual</span>
              </div>
            </div>
          </div>

          <div className="stats-details">
            <div className="stat-detail">
              <span className="stat-detail-label">Total Investido:</span>
              <span className="stat-detail-value">{formatCurrency(userStats.totalInvested)}</span>
            </div>
            <div className="stat-detail">
              <span className="stat-detail-label">Total Ganho:</span>
              <span className="stat-detail-value success">{formatCurrency(userStats.totalEarnings)}</span>
            </div>
            <div className="stat-detail">
              <span className="stat-detail-label">Maior Vitória:</span>
              <span className="stat-detail-value">{formatCurrency(userStats.biggestWin)}</span>
            </div>
            <div className="stat-detail">
              <span className="stat-detail-label">Entrada Média:</span>
              <span className="stat-detail-value">{formatCurrency(userStats.averageEntry)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Stats */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="profile-stats-card">
          <CardHeader className="profile-stats-header">
            <CardTitle className="profile-stats-title">
              <Calendar className="w-5 h-5 text-chronos-gold" />
              Este Mês
            </CardTitle>
          </CardHeader>

          <CardContent className="profile-stats-content">
            <div className="monthly-stats">
              <div className="monthly-stat">
                <span className="monthly-stat-value">{userStats.monthlyStats.sweepstakes}</span>
                <span className="monthly-stat-label">Sorteios</span>
              </div>
              <div className="monthly-stat">
                <span className="monthly-stat-value">{userStats.monthlyStats.wins}</span>
                <span className="monthly-stat-label">Vitórias</span>
              </div>
              <div className="monthly-stat">
                <span className="monthly-stat-value success">{formatCurrency(userStats.monthlyStats.earnings)}</span>
                <span className="monthly-stat-label">Ganhos</span>
              </div>
            </div>

            <div className="monthly-insights">
              <div className="insight-item">
                <span className="insight-label">Horário Favorito:</span>
                <span className="insight-value">{userStats.favoriteTime}</span>
              </div>
              <div className="insight-item">
                <span className="insight-label">Tipo Favorito:</span>
                <span className="insight-value">{userStats.favoriteType}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <Card className="profile-stats-card">
          <CardHeader className="profile-stats-header">
            <CardTitle className="profile-stats-title">
              <Award className="w-5 h-5 text-chronos-gold" />
              Conquistas
            </CardTitle>
          </CardHeader>

          <CardContent className="profile-stats-content">
            <div className="achievements-list">
              {userStats.achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="achievement-icon">
                    {achievement.unlocked ? (
                      <Star className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <Star className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  
                  <div className="achievement-content">
                    <h4 className="achievement-name">{achievement.name}</h4>
                    <p className="achievement-description">{achievement.description}</p>
                    
                    {!achievement.unlocked && achievement.progress && (
                      <div className="achievement-progress">
                        <Progress value={achievement.progress} className="achievement-progress-bar" />
                        <span className="achievement-progress-text">{achievement.progress}%</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <Card className="profile-quick-actions-card">
          <CardHeader className="profile-quick-actions-header">
            <CardTitle className="profile-quick-actions-title">
              Ações Rápidas
            </CardTitle>
          </CardHeader>

          <CardContent className="profile-quick-actions-content">
            <div className="quick-actions-grid">
              <button className="quick-action-btn">
                <Trophy className="w-4 h-4" />
                <span>Ver Histórico</span>
              </button>
              
              <button className="quick-action-btn">
                <Target className="w-4 h-4" />
                <span>Sorteios Ativos</span>
              </button>
              
              <button className="quick-action-btn">
                <TrendingUp className="w-4 h-4" />
                <span>Relatórios</span>
              </button>
              
              <button className="quick-action-btn">
                <Award className="w-4 h-4" />
                <span>Conquistas</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
