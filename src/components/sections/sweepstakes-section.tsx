'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  Clock,
  DollarSign,
  Trophy,
  Play,
  Eye,
  Sparkles
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Mock data for active sweepstakes
const activeSweepstakes = [
  {
    id: '1',
    title: 'Mega Jackpot Noturno',
    participants: 15000,
    maxParticipants: 20000,
    prizePool: 25000,
    betAmount: 16.50,
    timeLeft: 3600, // seconds
    type: 'INDIVIDUAL',
    status: 'ACTIVE'
  },
  {
    id: '2',
    title: 'Duelo X1 Relâmpago',
    participants: 2,
    maxParticipants: 2,
    prizePool: 900,
    betAmount: 4.50,
    timeLeft: 180,
    type: 'X1',
    status: 'STARTING'
  },
  {
    id: '3',
    title: 'Batalha em Grupo',
    participants: 8,
    maxParticipants: 10,
    prizePool: 1500,
    betAmount: 8.50,
    timeLeft: 900,
    type: 'X1_GROUP',
    status: 'ACTIVE'
  }
]

function CountdownTimer({ timeLeft }: { timeLeft: number }) {
  const [time, setTime] = useState(timeLeft)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = time % 60

  return (
    <div className="flex items-center space-x-1 text-chronos-gold font-mono">
      <Clock className="h-4 w-4" />
      <span>
        {hours.toString().padStart(2, '0')}:
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}
      </span>
    </div>
  )
}

function SweepstakeCard({ sweepstake, index }: { sweepstake: any, index: number }) {
  const progressPercentage = (sweepstake.participants / sweepstake.maxParticipants) * 100

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500'
      case 'STARTING': return 'bg-orange-500 animate-pulse'
      case 'COMPLETED': return 'bg-gray-500'
      default: return 'bg-blue-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'X1': return <Sparkles className="h-4 w-4" />
      case 'X1_GROUP': return <Users className="h-4 w-4" />
      default: return <Trophy className="h-4 w-4" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="chronos-card hover:border-chronos-gold/50 transition-all duration-300 group overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getTypeIcon(sweepstake.type)}
              <CardTitle className="text-lg text-chronos-ivory group-hover:text-chronos-gold transition-colors font-titles">
                {sweepstake.title}
              </CardTitle>
            </div>
            {sweepstake.status === 'STARTING' || sweepstake.status === 'ACTIVE' ? (
              <div className="live-indicator">
                <span className="live-dot"></span>
                AO VIVO
              </div>
            ) : (
              <Badge
                variant="outline"
                className={`${getStatusColor(sweepstake.status)} border-0 text-white text-xs`}
              >
                {sweepstake.status}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Prize Pool */}
          <div className="text-center space-y-1">
            <p className="text-sm text-chronos-ivory/60">Prêmio Total</p>
            <p className="text-2xl font-bold chronos-text-gold">
              {formatCurrency(sweepstake.prizePool)} Chronos
            </p>
          </div>

          {/* Participants Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-chronos-ivory/60">Participantes</span>
              <span className="text-chronos-ivory">
                {sweepstake.participants}/{sweepstake.maxParticipants}
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-2 bg-chronos-charcoal/50"
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-chronos-ivory/60 flex items-center">
                <DollarSign className="h-3 w-3 mr-1" />
                Entrada
              </p>
              <p className="text-chronos-ivory font-semibold">
                {formatCurrency(sweepstake.betAmount)} Chronos
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-chronos-ivory/60">Tempo Restante</p>
              <CountdownTimer timeLeft={sweepstake.timeLeft} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button
              asChild
              className="flex-1 chronos-button-gold hover:scale-105 transition-transform"
            >
              <Link href={`/sweepstakes/${sweepstake.id}`}>
                <Play className="mr-2 h-4 w-4" />
                Participar
              </Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-chronos-bronze text-chronos-bronze hover:bg-chronos-bronze hover:text-chronos-charcoal"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function SweepstakesSection() {
  return (
    <section className="current-sweepstakes">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Sorteio Ativo</h2>
          <p className="section-subtitle">
            Participe do sorteio em andamento e concorra a prêmios incríveis.
            Transparência garantida com tecnologia criptográfica.
          </p>
        </div>

        {/* Main Sweepstake Card */}
        <div className="sweepstakes-card">
          <div className="sweepstakes-header">
            <h2>Mega Sorteio Noturno</h2>
            <div className="live-indicator">
              <span className="live-dot"></span>
              AO VIVO
            </div>
          </div>

          <div className="sweepstakes-info">
            <div className="sweepstakes-stat">
              <span className="stat-number">15.000</span>
              <span className="stat-text">Participantes</span>
            </div>
            <div className="sweepstakes-stat">
              <span className="stat-number">R$ 25.000</span>
              <span className="stat-text">Prêmio Total</span>
            </div>
            <div className="sweepstakes-stat">
              <span className="stat-number">R$ 16,50</span>
              <span className="stat-text">Entrada</span>
            </div>
          </div>

          <div className="sweepstakes-timer">
            <span className="timer-label">Tempo Restante</span>
            <div className="timer">
              <div className="timer-unit">
                <span className="timer-number">01</span>
                <span className="timer-text">H</span>
              </div>
              <div className="timer-unit">
                <span className="timer-number">23</span>
                <span className="timer-text">M</span>
              </div>
              <div className="timer-unit">
                <span className="timer-number">45</span>
                <span className="timer-text">S</span>
              </div>
            </div>
          </div>

          <button className="btn-sweepstakes">
            <Trophy className="w-5 h-5" />
            Participar Agora
          </button>

          <div className="sweepstakes-participants">
            <div className="participants-avatars">
              <div className="participant-avatar">A</div>
              <div className="participant-avatar">B</div>
              <div className="participant-avatar">C</div>
              <div className="participant-avatar">D</div>
              <div className="participant-avatar">E</div>
              <span className="participant-count">+14.995</span>
            </div>
            <p className="participants-message">
              Mais de 15 mil pessoas já estão participando!
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
