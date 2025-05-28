'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Trophy, 
  Users, 
  Clock,
  Eye,
  Crown,
  Target
} from 'lucide-react'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'

interface SweepstakesHistoryProps {
  userId: string
}

interface SweepstakeHistoryItem {
  id: string
  title: string
  participants: number
  entryFee: number
  prizePool: number
  status: 'won' | 'lost' | 'active' | 'cancelled'
  position?: number
  prize?: number
  participatedAt: Date
  finishedAt?: Date
}

// Mock data
const mockSweepstakes: SweepstakeHistoryItem[] = [
  {
    id: 'sweep_001',
    title: 'Mega Sorteio Noturno #1247',
    participants: 18500,
    entryFee: 1.50,
    prizePool: 25000,
    status: 'won',
    position: 1,
    prize: 23750,
    participatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    finishedAt: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: 'sweep_002',
    title: 'Duelo X1 Relâmpago #892',
    participants: 2,
    entryFee: 450,
    prizePool: 900,
    status: 'lost',
    position: 2,
    participatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    finishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4)
  },
  {
    id: 'sweep_003',
    title: 'Batalha Vespertina #445',
    participants: 8,
    entryFee: 150,
    prizePool: 1200,
    status: 'active',
    participatedAt: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: 'sweep_004',
    title: 'Sorteio Matinal #1156',
    participants: 5420,
    entryFee: 2.00,
    prizePool: 10000,
    status: 'won',
    position: 1,
    prize: 9500,
    participatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    finishedAt: new Date(Date.now() - 1000 * 60 * 60 * 20)
  },
  {
    id: 'sweep_005',
    title: 'Mega Especial #999',
    participants: 1000,
    entryFee: 5.00,
    prizePool: 4750,
    status: 'lost',
    position: 156,
    participatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    finishedAt: new Date(Date.now() - 1000 * 60 * 60 * 46)
  }
]

const getStatusBadge = (status: string, position?: number) => {
  switch (status) {
    case 'won':
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          <Crown className="w-3 h-3 mr-1" />
          Venceu #{position}
        </Badge>
      )
    case 'lost':
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          <Target className="w-3 h-3 mr-1" />
          #{position}
        </Badge>
      )
    case 'active':
      return (
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          <Clock className="w-3 h-3 mr-1" />
          Ativo
        </Badge>
      )
    case 'cancelled':
      return (
        <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
          Cancelado
        </Badge>
      )
    default:
      return null
  }
}

export function SweepstakesHistory({ userId }: SweepstakesHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'won' | 'lost' | 'active'>('all')

  const filteredSweepstakes = mockSweepstakes.filter(sweepstake => {
    if (filter === 'all') return true
    return sweepstake.status === filter
  })

  const totalWon = mockSweepstakes
    .filter(s => s.status === 'won')
    .reduce((sum, s) => sum + (s.prize || 0), 0)

  const totalSpent = mockSweepstakes
    .reduce((sum, s) => sum + s.entryFee, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sweepstakes-history"
    >
      {/* Summary */}
      <div className="sweepstakes-history-summary">
        <div className="summary-stat">
          <span className="summary-stat-value success">
            {formatCurrency(totalWon)}
          </span>
          <span className="summary-stat-label">Total ganho</span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat-value">
            {formatCurrency(totalSpent)}
          </span>
          <span className="summary-stat-label">Total investido</span>
        </div>
        <div className="summary-stat">
          <span className={`summary-stat-value ${totalWon > totalSpent ? 'success' : 'danger'}`}>
            {formatCurrency(totalWon - totalSpent)}
          </span>
          <span className="summary-stat-label">Resultado líquido</span>
        </div>
      </div>

      {/* Filters */}
      <div className="sweepstakes-history-filters">
        <button
          onClick={() => setFilter('all')}
          className={`history-filter ${filter === 'all' ? 'active' : ''}`}
        >
          Todos ({mockSweepstakes.length})
        </button>
        <button
          onClick={() => setFilter('won')}
          className={`history-filter ${filter === 'won' ? 'active' : ''}`}
        >
          Vitórias ({mockSweepstakes.filter(s => s.status === 'won').length})
        </button>
        <button
          onClick={() => setFilter('lost')}
          className={`history-filter ${filter === 'lost' ? 'active' : ''}`}
        >
          Derrotas ({mockSweepstakes.filter(s => s.status === 'lost').length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`history-filter ${filter === 'active' ? 'active' : ''}`}
        >
          Ativos ({mockSweepstakes.filter(s => s.status === 'active').length})
        </button>
      </div>

      {/* List */}
      <div className="sweepstakes-history-list">
        {filteredSweepstakes.map((sweepstake, index) => (
          <motion.div
            key={sweepstake.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className={`sweepstake-history-item ${sweepstake.status}`}>
              <CardContent className="sweepstake-history-content">
                <div className="sweepstake-history-header">
                  <div className="sweepstake-history-info">
                    <h3 className="sweepstake-history-title">
                      {sweepstake.title}
                    </h3>
                    <div className="sweepstake-history-meta">
                      <span className="sweepstake-history-participants">
                        <Users className="w-4 h-4" />
                        {sweepstake.participants.toLocaleString()} participantes
                      </span>
                      <span className="sweepstake-history-time">
                        <Clock className="w-4 h-4" />
                        {formatRelativeTime(sweepstake.participatedAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="sweepstake-history-status">
                    {getStatusBadge(sweepstake.status, sweepstake.position)}
                  </div>
                </div>

                <div className="sweepstake-history-details">
                  <div className="sweepstake-history-detail">
                    <span className="detail-label">Entrada:</span>
                    <span className="detail-value">
                      {formatCurrency(sweepstake.entryFee)}
                    </span>
                  </div>
                  <div className="sweepstake-history-detail">
                    <span className="detail-label">Prêmio Total:</span>
                    <span className="detail-value">
                      {formatCurrency(sweepstake.prizePool)}
                    </span>
                  </div>
                  {sweepstake.prize && (
                    <div className="sweepstake-history-detail">
                      <span className="detail-label">Seu Prêmio:</span>
                      <span className="detail-value success">
                        {formatCurrency(sweepstake.prize)}
                      </span>
                    </div>
                  )}
                  {sweepstake.finishedAt && (
                    <div className="sweepstake-history-detail">
                      <span className="detail-label">Finalizado:</span>
                      <span className="detail-value">
                        {formatRelativeTime(sweepstake.finishedAt)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="sweepstake-history-actions">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/sweepstakes/${sweepstake.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Link>
                  </Button>
                  
                  {sweepstake.status === 'won' && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/audit/sweepstake/${sweepstake.id}`}>
                        <Trophy className="w-4 h-4 mr-2" />
                        Ver Prova
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <div className="sweepstakes-history-load-more">
        <Button variant="outline">
          Carregar Mais Sorteios
        </Button>
      </div>
    </motion.div>
  )
}
