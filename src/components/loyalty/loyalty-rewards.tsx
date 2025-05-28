'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Gift, 
  Star, 
  Crown, 
  Zap, 
  Calendar,
  Trophy,
  Coins,
  Clock,
  CheckCircle,
  Lock
} from 'lucide-react'

interface LoyaltyReward {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'monthly' | 'milestone'
  requirement: number
  reward: {
    type: 'coins' | 'bonus' | 'multiplier' | 'badge'
    value: number
    description: string
  }
  claimed: boolean
  available: boolean
  progress: number
  icon: string
}

interface LoyaltyStats {
  currentStreak: number
  longestStreak: number
  totalDays: number
  totalRewards: number
  nextReward: LoyaltyReward | null
}

// Mock loyalty data
const mockRewards: LoyaltyReward[] = [
  {
    id: '1',
    title: 'Login Diário',
    description: 'Faça login todos os dias',
    type: 'daily',
    requirement: 1,
    reward: {
      type: 'coins',
      value: 50,
      description: '50 Chronos Coins'
    },
    claimed: false,
    available: true,
    progress: 1,
    icon: '🎯'
  },
  {
    id: '2',
    title: 'Sequência de 7 Dias',
    description: 'Faça login por 7 dias consecutivos',
    type: 'weekly',
    requirement: 7,
    reward: {
      type: 'bonus',
      value: 200,
      description: 'R$ 200 de bônus'
    },
    claimed: false,
    available: false,
    progress: 3,
    icon: '🔥'
  },
  {
    id: '3',
    title: 'Mestre da Consistência',
    description: 'Faça login por 30 dias consecutivos',
    type: 'monthly',
    requirement: 30,
    reward: {
      type: 'multiplier',
      value: 150,
      description: '1.5x multiplicador por 24h'
    },
    claimed: false,
    available: false,
    progress: 12,
    icon: '👑'
  },
  {
    id: '4',
    title: 'Veterano Chronos',
    description: 'Complete 100 dias de login',
    type: 'milestone',
    requirement: 100,
    reward: {
      type: 'badge',
      value: 1,
      description: 'Badge Veterano Exclusiva'
    },
    claimed: false,
    available: false,
    progress: 45,
    icon: '🏆'
  }
]

const mockStats: LoyaltyStats = {
  currentStreak: 3,
  longestStreak: 12,
  totalDays: 45,
  totalRewards: 8,
  nextReward: mockRewards[1]
}

export function LoyaltyRewards() {
  const [rewards, setRewards] = useState<LoyaltyReward[]>(mockRewards)
  const [stats, setStats] = useState<LoyaltyStats>(mockStats)
  const [isLoading, setIsLoading] = useState(false)

  const claimReward = async (rewardId: string) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setRewards(prevRewards =>
        prevRewards.map(reward =>
          reward.id === rewardId
            ? { ...reward, claimed: true, available: false }
            : reward
        )
      )

      setStats(prevStats => ({
        ...prevStats,
        totalRewards: prevStats.totalRewards + 1
      }))

      alert('Recompensa coletada com sucesso!')
    } catch (error) {
      console.error('Erro ao coletar recompensa:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'coins':
        return <Coins className="w-5 h-5 text-yellow-400" />
      case 'bonus':
        return <Gift className="w-5 h-5 text-green-400" />
      case 'multiplier':
        return <Zap className="w-5 h-5 text-purple-400" />
      case 'badge':
        return <Trophy className="w-5 h-5 text-blue-400" />
      default:
        return <Star className="w-5 h-5 text-gray-400" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'weekly':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'monthly':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'milestone':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="loyalty-rewards"
    >
      {/* Stats Header */}
      <Card className="loyalty-stats-card">
        <CardHeader>
          <CardTitle className="loyalty-stats-title">
            <Crown className="w-6 h-6 text-yellow-500" />
            Programa de Fidelidade
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="loyalty-stats-grid">
            <div className="loyalty-stat">
              <div className="loyalty-stat-icon">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              <div className="loyalty-stat-content">
                <span className="loyalty-stat-value">{stats.currentStreak}</span>
                <span className="loyalty-stat-label">Sequência Atual</span>
              </div>
            </div>

            <div className="loyalty-stat">
              <div className="loyalty-stat-icon">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="loyalty-stat-content">
                <span className="loyalty-stat-value">{stats.longestStreak}</span>
                <span className="loyalty-stat-label">Maior Sequência</span>
              </div>
            </div>

            <div className="loyalty-stat">
              <div className="loyalty-stat-icon">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <div className="loyalty-stat-content">
                <span className="loyalty-stat-value">{stats.totalDays}</span>
                <span className="loyalty-stat-label">Total de Dias</span>
              </div>
            </div>

            <div className="loyalty-stat">
              <div className="loyalty-stat-icon">
                <Gift className="w-6 h-6 text-purple-400" />
              </div>
              <div className="loyalty-stat-content">
                <span className="loyalty-stat-value">{stats.totalRewards}</span>
                <span className="loyalty-stat-label">Recompensas</span>
              </div>
            </div>
          </div>

          {/* Next Reward Preview */}
          {stats.nextReward && (
            <div className="loyalty-next-reward">
              <h4>Próxima Recompensa:</h4>
              <div className="loyalty-next-reward-content">
                <span className="loyalty-next-reward-emoji">{stats.nextReward.icon}</span>
                <div className="loyalty-next-reward-info">
                  <span className="loyalty-next-reward-title">{stats.nextReward.title}</span>
                  <span className="loyalty-next-reward-description">{stats.nextReward.reward.description}</span>
                </div>
                <div className="loyalty-next-reward-progress">
                  <Progress 
                    value={(stats.nextReward.progress / stats.nextReward.requirement) * 100} 
                    className="loyalty-progress-bar"
                  />
                  <span className="loyalty-progress-text">
                    {stats.nextReward.progress}/{stats.nextReward.requirement}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rewards List */}
      <div className="loyalty-rewards-grid">
        {rewards.map((reward, index) => (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`loyalty-reward-card ${reward.claimed ? 'claimed' : ''} ${reward.available ? 'available' : ''}`}>
              <CardHeader>
                <div className="loyalty-reward-header">
                  <div className="loyalty-reward-icon">
                    <span className="loyalty-reward-emoji">{reward.icon}</span>
                  </div>
                  
                  <div className="loyalty-reward-info">
                    <CardTitle className="loyalty-reward-title">
                      {reward.title}
                    </CardTitle>
                    <p className="loyalty-reward-description">
                      {reward.description}
                    </p>
                  </div>

                  <Badge className={`loyalty-reward-type ${getTypeColor(reward.type)}`}>
                    {reward.type === 'daily' && 'Diário'}
                    {reward.type === 'weekly' && 'Semanal'}
                    {reward.type === 'monthly' && 'Mensal'}
                    {reward.type === 'milestone' && 'Marco'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="loyalty-reward-content">
                  <div className="loyalty-reward-prize">
                    {getRewardIcon(reward.reward.type)}
                    <span className="loyalty-reward-prize-text">
                      {reward.reward.description}
                    </span>
                  </div>

                  <div className="loyalty-reward-progress">
                    <Progress 
                      value={(reward.progress / reward.requirement) * 100}
                      className="loyalty-reward-progress-bar"
                    />
                    <span className="loyalty-reward-progress-text">
                      {reward.progress}/{reward.requirement}
                    </span>
                  </div>

                  <div className="loyalty-reward-action">
                    {reward.claimed ? (
                      <Button disabled className="loyalty-reward-button claimed">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Coletado
                      </Button>
                    ) : reward.available ? (
                      <Button
                        onClick={() => claimReward(reward.id)}
                        disabled={isLoading}
                        className="loyalty-reward-button available"
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        Coletar
                      </Button>
                    ) : (
                      <Button disabled className="loyalty-reward-button locked">
                        <Lock className="w-4 h-4 mr-2" />
                        Bloqueado
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Daily Check-in */}
      <Card className="loyalty-checkin-card">
        <CardHeader>
          <CardTitle className="loyalty-checkin-title">
            <Calendar className="w-6 h-6 text-blue-500" />
            Check-in Diário
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="loyalty-checkin-calendar">
            {Array.from({ length: 7 }, (_, i) => {
              const day = i + 1
              const isCompleted = day <= stats.currentStreak
              const isToday = day === stats.currentStreak + 1
              
              return (
                <div
                  key={day}
                  className={`loyalty-checkin-day ${isCompleted ? 'completed' : ''} ${isToday ? 'today' : ''}`}
                >
                  <span className="loyalty-checkin-day-number">Dia {day}</span>
                  <div className="loyalty-checkin-day-icon">
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : isToday ? (
                      <Clock className="w-6 h-6 text-blue-400" />
                    ) : (
                      <div className="loyalty-checkin-day-empty" />
                    )}
                  </div>
                  <span className="loyalty-checkin-day-reward">
                    +{day * 10} coins
                  </span>
                </div>
              )
            })}
          </div>

          <div className="loyalty-checkin-info">
            <p>Faça login todos os dias para manter sua sequência e ganhar recompensas crescentes!</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
