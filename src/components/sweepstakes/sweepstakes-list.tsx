'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy, 
  Users, 
  Clock, 
  DollarSign,
  Play,
  Eye,
  Zap,
  Calendar
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Mock data - em produção viria da API
const sweepstakes = [
  {
    id: '1',
    title: 'Mega Sorteio Noturno',
    type: 'INDIVIDUAL',
    status: 'ACTIVE',
    participants: 15000,
    maxParticipants: 20000,
    prizePool: 25000,
    entryFee: 16.50,
    timeLeft: '01:23:45',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 1.5),
    isHot: true,
    category: 'quick'
  },
  {
    id: '2',
    title: 'Duelo X1 Relâmpago',
    type: 'X1',
    status: 'STARTING',
    participants: 1,
    maxParticipants: 2,
    prizePool: 900,
    entryFee: 4.50,
    timeLeft: '00:03:12',
    startTime: new Date(Date.now() + 1000 * 60 * 3),
    isHot: false,
    category: 'x1'
  },
  {
    id: '3',
    title: 'Batalha em Grupo Alpha',
    type: 'X1_GROUP',
    status: 'ACTIVE',
    participants: 8,
    maxParticipants: 10,
    prizePool: 1500,
    entryFee: 8.50,
    timeLeft: '00:15:30',
    startTime: new Date(Date.now() + 1000 * 60 * 15),
    isHot: false,
    category: 'group'
  },
  {
    id: '4',
    title: 'Demo Gratuito',
    type: 'DEMO',
    status: 'ACTIVE',
    participants: 45,
    maxParticipants: 100,
    prizePool: 0,
    entryFee: 0,
    timeLeft: '02:45:12',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 2.75),
    isHot: false,
    category: 'demo'
  },
  {
    id: '5',
    title: 'Evento Mensal Premium',
    type: 'MONTHLY',
    status: 'SCHEDULED',
    participants: 2847,
    maxParticipants: 5000,
    prizePool: 50000,
    entryFee: 25.00,
    timeLeft: '23:45:30',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24),
    isHot: true,
    category: 'monthly'
  },
  {
    id: '6',
    title: 'Sorteio Rápido Vespertino',
    type: 'INDIVIDUAL',
    status: 'ACTIVE',
    participants: 234,
    maxParticipants: 500,
    prizePool: 2500,
    entryFee: 5.00,
    timeLeft: '00:45:20',
    startTime: new Date(Date.now() + 1000 * 60 * 45),
    isHot: false,
    category: 'quick'
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>
    case 'STARTING':
      return (
        <div className="live-indicator">
          <span className="live-dot"></span>
          INICIANDO
        </div>
      )
    case 'SCHEDULED':
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Agendado</Badge>
    default:
      return <Badge variant="outline">Desconhecido</Badge>
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'X1':
      return <Trophy className="w-4 h-4" />
    case 'X1_GROUP':
      return <Users className="w-4 h-4" />
    case 'DEMO':
      return <Play className="w-4 h-4" />
    case 'MONTHLY':
      return <Calendar className="w-4 h-4" />
    default:
      return <Zap className="w-4 h-4" />
  }
}

export function SweepstakesList() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="sweepstakes-list"
    >
      <div className="sweepstakes-list-header">
        <h2 className="sweepstakes-list-title">
          Sorteios Disponíveis
        </h2>
        <p className="sweepstakes-list-subtitle">
          {sweepstakes.length} sorteios encontrados
        </p>
      </div>

      <div className="sweepstakes-grid">
        {sweepstakes.map((sweepstake, index) => (
          <motion.div
            key={sweepstake.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            className={`sweepstake-card ${sweepstake.isHot ? 'hot' : ''}`}
          >
            {/* Hot Badge */}
            {sweepstake.isHot && (
              <div className="sweepstake-hot-badge">
                🔥 HOT
              </div>
            )}

            {/* Card Header */}
            <div className="sweepstake-card-header">
              <div className="sweepstake-card-title-row">
                <div className="sweepstake-card-type">
                  {getTypeIcon(sweepstake.type)}
                </div>
                <h3 className="sweepstake-card-title">
                  {sweepstake.title}
                </h3>
              </div>
              {getStatusBadge(sweepstake.status)}
            </div>

            {/* Card Stats */}
            <div className="sweepstake-card-stats">
              <div className="sweepstake-card-stat">
                <Users className="sweepstake-card-stat-icon" />
                <span className="sweepstake-card-stat-text">
                  {sweepstake.participants}/{sweepstake.maxParticipants}
                </span>
              </div>
              
              <div className="sweepstake-card-stat">
                <DollarSign className="sweepstake-card-stat-icon" />
                <span className="sweepstake-card-stat-text">
                  {sweepstake.prizePool > 0 ? formatCurrency(sweepstake.prizePool) : 'Gratuito'}
                </span>
              </div>
              
              <div className="sweepstake-card-stat">
                <Clock className="sweepstake-card-stat-icon" />
                <span className="sweepstake-card-stat-text">
                  {sweepstake.timeLeft}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="sweepstake-card-progress">
              <div className="sweepstake-card-progress-bar">
                <div 
                  className="sweepstake-card-progress-fill"
                  style={{ 
                    width: `${(sweepstake.participants / sweepstake.maxParticipants) * 100}%` 
                  }}
                />
              </div>
              <span className="sweepstake-card-progress-text">
                {Math.round((sweepstake.participants / sweepstake.maxParticipants) * 100)}% preenchido
              </span>
            </div>

            {/* Entry Fee */}
            <div className="sweepstake-card-entry">
              <span className="sweepstake-card-entry-label">Entrada:</span>
              <span className="sweepstake-card-entry-value">
                {sweepstake.entryFee > 0 ? `${formatCurrency(sweepstake.entryFee)} Chronos` : 'Gratuito'}
              </span>
            </div>

            {/* Actions */}
            <div className="sweepstake-card-actions">
              <Button asChild className="sweepstake-card-join-btn">
                <Link href={`/sweepstakes/${sweepstake.id}`}>
                  <Play className="w-4 h-4 mr-2" />
                  {sweepstake.entryFee > 0 ? 'Participar' : 'Jogar Grátis'}
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="sm" className="sweepstake-card-view-btn">
                <Link href={`/sweepstakes/${sweepstake.id}`}>
                  <Eye className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="sweepstakes-load-more"
      >
        <Button variant="outline" size="lg" className="sweepstakes-load-more-btn">
          Carregar Mais Sorteios
        </Button>
      </motion.div>
    </motion.div>
  )
}
