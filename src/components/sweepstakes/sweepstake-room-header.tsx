'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Trophy, 
  Users, 
  DollarSign, 
  Share2,
  Bookmark,
  Flag
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface SweepstakeHeaderProps {
  sweepstake: {
    id: string
    title: string
    type: string
    status: string
    participants: number
    maxParticipants: number
    prizePool: number
    entryFee: number
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return (
        <div className="live-indicator">
          <span className="live-dot"></span>
          AO VIVO
        </div>
      )
    case 'STARTING':
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Iniciando</Badge>
    case 'SCHEDULED':
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Agendado</Badge>
    case 'FINISHED':
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Finalizado</Badge>
    default:
      return <Badge variant="outline">Desconhecido</Badge>
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'X1':
      return 'Duelo X1'
    case 'X1_GROUP':
      return 'Batalha em Grupo'
    case 'DEMO':
      return 'Demo Gratuito'
    case 'MONTHLY':
      return 'Evento Mensal'
    default:
      return 'Sorteio Individual'
  }
}

export function SweepstakeHeader({ sweepstake }: SweepstakeHeaderProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: sweepstake.title,
        text: `Participe do ${sweepstake.title} na Chronos Platform!`,
        url: window.location.href,
      })
    } else {
      // Fallback para copiar URL
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="sweepstake-room-header">
      <div className="sweepstake-room-header-content">
        {/* Navigation */}
        <div className="sweepstake-room-nav">
          <Button asChild variant="outline" size="sm" className="sweepstake-back-btn">
            <Link href="/sweepstakes">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Sorteios
            </Link>
          </Button>

          <div className="sweepstake-room-actions">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Flag className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Title Section */}
        <div className="sweepstake-room-title-section">
          <div className="sweepstake-room-title-main">
            <h1 className="sweepstake-room-title">
              {sweepstake.title}
            </h1>
            <div className="sweepstake-room-badges">
              {getStatusBadge(sweepstake.status)}
              <Badge variant="outline" className="sweepstake-type-badge">
                {getTypeLabel(sweepstake.type)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="sweepstake-room-stats">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="sweepstake-room-stat"
          >
            <div className="sweepstake-room-stat-icon">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="sweepstake-room-stat-content">
              <span className="sweepstake-room-stat-value">
                {formatCurrency(sweepstake.prizePool)}
              </span>
              <span className="sweepstake-room-stat-label">
                Prêmio Total
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="sweepstake-room-stat"
          >
            <div className="sweepstake-room-stat-icon">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div className="sweepstake-room-stat-content">
              <span className="sweepstake-room-stat-value">
                {sweepstake.participants}/{sweepstake.maxParticipants}
              </span>
              <span className="sweepstake-room-stat-label">
                Participantes
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="sweepstake-room-stat"
          >
            <div className="sweepstake-room-stat-icon">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div className="sweepstake-room-stat-content">
              <span className="sweepstake-room-stat-value">
                {sweepstake.entryFee > 0 ? formatCurrency(sweepstake.entryFee) : 'Gratuito'}
              </span>
              <span className="sweepstake-room-stat-label">
                Entrada
              </span>
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="sweepstake-room-progress"
        >
          <div className="sweepstake-room-progress-bar">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(sweepstake.participants / sweepstake.maxParticipants) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="sweepstake-room-progress-fill"
            />
          </div>
          <div className="sweepstake-room-progress-text">
            <span>{Math.round((sweepstake.participants / sweepstake.maxParticipants) * 100)}% preenchido</span>
            <span>{sweepstake.maxParticipants - sweepstake.participants} vagas restantes</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
