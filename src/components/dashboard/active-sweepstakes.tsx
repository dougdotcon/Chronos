'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy, 
  Users, 
  Clock, 
  DollarSign,
  Play,
  Eye
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Mock data - em produção viria da API
const activeSweepstakes = [
  {
    id: '1',
    title: 'Mega Sorteio Noturno',
    participants: 15000,
    maxParticipants: 20000,
    prizePool: 25000,
    betAmount: 16.50,
    timeLeft: '01:23:45',
    type: 'INDIVIDUAL',
    status: 'ACTIVE'
  },
  {
    id: '2',
    title: 'Duelo X1 Relâmpago',
    participants: 1,
    maxParticipants: 2,
    prizePool: 900,
    betAmount: 4.50,
    timeLeft: '00:03:12',
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
    timeLeft: '00:15:30',
    type: 'X1_GROUP',
    status: 'ACTIVE'
  }
]

export function ActiveSweepstakes() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Card className="active-sweepstakes-card">
        <CardHeader className="active-sweepstakes-header">
          <div className="active-sweepstakes-title-row">
            <CardTitle className="active-sweepstakes-title">
              <Trophy className="w-5 h-5 text-chronos-gold" />
              Sorteios Ativos
            </CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/sweepstakes">
                Ver Todos
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="active-sweepstakes-content">
          <div className="active-sweepstakes-list">
            {activeSweepstakes.map((sweepstake, index) => (
              <motion.div
                key={sweepstake.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="sweepstake-item"
              >
                <div className="sweepstake-header">
                  <div className="sweepstake-info">
                    <h3 className="sweepstake-title">
                      {sweepstake.title}
                    </h3>
                    <div className="sweepstake-badges">
                      {sweepstake.status === 'STARTING' ? (
                        <div className="live-indicator">
                          <span className="live-dot"></span>
                          INICIANDO
                        </div>
                      ) : (
                        <Badge variant="outline" className="sweepstake-badge">
                          {sweepstake.type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="sweepstake-stats">
                  <div className="sweepstake-stat">
                    <Users className="sweepstake-stat-icon" />
                    <span className="sweepstake-stat-text">
                      {sweepstake.participants}/{sweepstake.maxParticipants}
                    </span>
                  </div>
                  
                  <div className="sweepstake-stat">
                    <DollarSign className="sweepstake-stat-icon" />
                    <span className="sweepstake-stat-text">
                      {formatCurrency(sweepstake.prizePool)}
                    </span>
                  </div>
                  
                  <div className="sweepstake-stat">
                    <Clock className="sweepstake-stat-icon" />
                    <span className="sweepstake-stat-text">
                      {sweepstake.timeLeft}
                    </span>
                  </div>
                </div>

                <div className="sweepstake-actions">
                  <Button asChild size="sm" className="sweepstake-join-btn">
                    <Link href={`/sweepstakes/${sweepstake.id}`}>
                      <Play className="w-4 h-4" />
                      Participar
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" size="sm" className="sweepstake-view-btn">
                    <Link href={`/sweepstakes/${sweepstake.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>

                <div className="sweepstake-entry">
                  <span className="sweepstake-entry-text">
                    Entrada: {formatCurrency(sweepstake.betAmount)} Chronos
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {activeSweepstakes.length === 0 && (
            <div className="no-sweepstakes">
              <Trophy className="no-sweepstakes-icon" />
              <p className="no-sweepstakes-text">
                Nenhum sorteio ativo no momento
              </p>
              <Button asChild className="no-sweepstakes-btn">
                <Link href="/sweepstakes">
                  Explorar Sorteios
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
