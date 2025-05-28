'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Trophy, 
  Crown, 
  Star,
  Users,
  Clock,
  Eye,
  Download,
  TrendingUp
} from 'lucide-react'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'

interface PrizesHistoryProps {
  userId: string
}

interface Prize {
  id: string
  sweepstakeId: string
  sweepstakeTitle: string
  amount: number
  position: number
  participants: number
  entryFee: number
  wonAt: Date
  claimedAt?: Date
  multiplier: number
  category: 'mega' | 'standard' | 'mini' | 'special'
  isVerified: boolean
}

// Mock data
const mockPrizes: Prize[] = [
  {
    id: 'prize_001',
    sweepstakeId: 'sweep_001',
    sweepstakeTitle: 'Mega Sorteio Noturno #1247',
    amount: 23750,
    position: 1,
    participants: 18500,
    entryFee: 1.50,
    wonAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    claimedAt: new Date(Date.now() - 1000 * 60 * 30),
    multiplier: 15833.33,
    category: 'mega',
    isVerified: true
  },
  {
    id: 'prize_002',
    sweepstakeId: 'sweep_004',
    sweepstakeTitle: 'Sorteio Matinal #1156',
    amount: 9500,
    position: 1,
    participants: 5420,
    entryFee: 2.00,
    wonAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    claimedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
    multiplier: 4750,
    category: 'standard',
    isVerified: true
  },
  {
    id: 'prize_003',
    sweepstakeId: 'sweep_007',
    sweepstakeTitle: 'Mini Sorteio Relâmpago #334',
    amount: 285,
    position: 1,
    participants: 200,
    entryFee: 1.50,
    wonAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    claimedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    multiplier: 190,
    category: 'mini',
    isVerified: true
  }
]

const getCategoryBadge = (category: string) => {
  switch (category) {
    case 'mega':
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          <Crown className="w-3 h-3 mr-1" />
          Mega
        </Badge>
      )
    case 'standard':
      return (
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          <Star className="w-3 h-3 mr-1" />
          Padrão
        </Badge>
      )
    case 'mini':
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          <Trophy className="w-3 h-3 mr-1" />
          Mini
        </Badge>
      )
    case 'special':
      return (
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
          <Star className="w-3 h-3 mr-1" />
          Especial
        </Badge>
      )
    default:
      return null
  }
}

const getMultiplierColor = (multiplier: number) => {
  if (multiplier >= 1000) return 'text-yellow-400'
  if (multiplier >= 100) return 'text-orange-400'
  if (multiplier >= 10) return 'text-green-400'
  return 'text-blue-400'
}

export function PrizesHistory({ userId }: PrizesHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'mega' | 'standard' | 'mini' | 'special'>('all')

  const filteredPrizes = mockPrizes.filter(prize => {
    if (filter === 'all') return true
    return prize.category === filter
  })

  const totalPrizes = mockPrizes.reduce((sum, prize) => sum + prize.amount, 0)
  const totalInvested = mockPrizes.reduce((sum, prize) => sum + prize.entryFee, 0)
  const averageMultiplier = mockPrizes.reduce((sum, prize) => sum + prize.multiplier, 0) / mockPrizes.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="prizes-history"
    >
      {/* Summary */}
      <div className="prizes-history-summary">
        <div className="summary-stat">
          <span className="summary-stat-value success">
            {formatCurrency(totalPrizes)}
          </span>
          <span className="summary-stat-label">Total em prêmios</span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat-value">
            {mockPrizes.length}
          </span>
          <span className="summary-stat-label">Vitórias</span>
        </div>
        <div className="summary-stat">
          <span className={`summary-stat-value ${getMultiplierColor(averageMultiplier)}`}>
            {averageMultiplier.toFixed(1)}x
          </span>
          <span className="summary-stat-label">Multiplicador médio</span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat-value success">
            {formatCurrency(totalPrizes - totalInvested)}
          </span>
          <span className="summary-stat-label">Lucro líquido</span>
        </div>
      </div>

      {/* Achievement Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="prizes-achievement-banner"
      >
        <div className="achievement-icon">
          🏆
        </div>
        <div className="achievement-content">
          <h3>Parabéns pelas suas vitórias!</h3>
          <p>
            Você já ganhou <strong>{mockPrizes.length} sorteios</strong> e 
            acumulou <strong>{formatCurrency(totalPrizes)}</strong> em prêmios!
          </p>
        </div>
        <div className="achievement-stats">
          <div className="achievement-stat">
            <TrendingUp className="w-4 h-4" />
            <span>ROI: {(((totalPrizes - totalInvested) / totalInvested) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="prizes-history-filters">
        <button
          onClick={() => setFilter('all')}
          className={`history-filter ${filter === 'all' ? 'active' : ''}`}
        >
          Todos ({mockPrizes.length})
        </button>
        <button
          onClick={() => setFilter('mega')}
          className={`history-filter ${filter === 'mega' ? 'active' : ''}`}
        >
          Mega ({mockPrizes.filter(p => p.category === 'mega').length})
        </button>
        <button
          onClick={() => setFilter('standard')}
          className={`history-filter ${filter === 'standard' ? 'active' : ''}`}
        >
          Padrão ({mockPrizes.filter(p => p.category === 'standard').length})
        </button>
        <button
          onClick={() => setFilter('mini')}
          className={`history-filter ${filter === 'mini' ? 'active' : ''}`}
        >
          Mini ({mockPrizes.filter(p => p.category === 'mini').length})
        </button>
      </div>

      {/* List */}
      <div className="prizes-history-list">
        {filteredPrizes.map((prize, index) => (
          <motion.div
            key={prize.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="prize-history-item">
              <CardContent className="prize-history-content">
                <div className="prize-history-header">
                  <div className="prize-history-info">
                    <div className="prize-history-main">
                      <div className="prize-history-icon">
                        <Trophy className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div className="prize-history-details">
                        <h3 className="prize-history-title">
                          {prize.sweepstakeTitle}
                        </h3>
                        <div className="prize-history-meta">
                          <span className="prize-participants">
                            <Users className="w-4 h-4" />
                            {prize.participants.toLocaleString()} participantes
                          </span>
                          <span className="prize-time">
                            <Clock className="w-4 h-4" />
                            {formatRelativeTime(prize.wonAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="prize-history-amount">
                      <span className="prize-amount">
                        {formatCurrency(prize.amount)}
                      </span>
                      <div className="prize-multiplier">
                        <span className={`multiplier-value ${getMultiplierColor(prize.multiplier)}`}>
                          {prize.multiplier.toFixed(1)}x
                        </span>
                        <span className="multiplier-label">multiplicador</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="prize-history-badges">
                    {getCategoryBadge(prize.category)}
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      <Crown className="w-3 h-3 mr-1" />
                      1º Lugar
                    </Badge>
                  </div>
                </div>

                <div className="prize-history-details-grid">
                  <div className="prize-detail">
                    <span className="detail-label">Entrada:</span>
                    <span className="detail-value">
                      {formatCurrency(prize.entryFee)}
                    </span>
                  </div>
                  <div className="prize-detail">
                    <span className="detail-label">Lucro:</span>
                    <span className="detail-value success">
                      {formatCurrency(prize.amount - prize.entryFee)}
                    </span>
                  </div>
                  <div className="prize-detail">
                    <span className="detail-label">Posição:</span>
                    <span className="detail-value">
                      #{prize.position} de {prize.participants.toLocaleString()}
                    </span>
                  </div>
                  {prize.claimedAt && (
                    <div className="prize-detail">
                      <span className="detail-label">Creditado:</span>
                      <span className="detail-value">
                        {formatRelativeTime(prize.claimedAt)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="prize-history-actions">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/sweepstakes/${prize.sweepstakeId}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Sorteio
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/audit/sweepstake/${prize.sweepstakeId}`}>
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Prova
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <div className="prizes-history-load-more">
        <Button variant="outline">
          Carregar Mais Prêmios
        </Button>
      </div>
    </motion.div>
  )
}
