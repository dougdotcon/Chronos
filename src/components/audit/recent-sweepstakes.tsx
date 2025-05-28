'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy, 
  Users, 
  Clock, 
  Shield,
  Eye,
  Download,
  CheckCircle
} from 'lucide-react'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'

// Mock data - em produção viria da API
const recentSweepstakes = [
  {
    id: 'sweep_001',
    title: 'Mega Sorteio Noturno #1247',
    participants: 18500,
    prizePool: 25000,
    winner: {
      id: 'user_winner_1',
      name: 'João S.',
      prize: 23750 // 95% do pool
    },
    executedAt: new Date(Date.now() - 1000 * 60 * 30),
    algorithm: 'SHA256_DETERMINISTIC',
    hash: 'a7f8e9d2c1b0f3e4d5c6b7a8e9f0d1c2b3a4e5f6d7c8b9a0e1f2d3c4b5a6e7f8',
    isVerified: true,
    houseFee: 1250
  },
  {
    id: 'sweep_002',
    title: 'Duelo X1 Relâmpago #892',
    participants: 2,
    prizePool: 900,
    winner: {
      id: 'user_winner_2',
      name: 'Maria O.',
      prize: 855 // 95% do pool
    },
    executedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    algorithm: 'SHA256_DETERMINISTIC',
    hash: 'b8e9f0a1d2c3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
    isVerified: true,
    houseFee: 45
  },
  {
    id: 'sweep_003',
    title: 'Batalha em Grupo Alpha #445',
    participants: 10,
    prizePool: 1500,
    winner: {
      id: 'user_winner_3',
      name: 'Pedro C.',
      prize: 1425 // 95% do pool
    },
    executedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    algorithm: 'SHA256_DETERMINISTIC',
    hash: 'c9f0a1b2e3d4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
    isVerified: true,
    houseFee: 75
  },
  {
    id: 'sweep_004',
    title: 'Sorteio Vespertino #1156',
    participants: 5420,
    prizePool: 8500,
    winner: {
      id: 'user_winner_4',
      name: 'Ana L.',
      prize: 8075 // 95% do pool
    },
    executedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    algorithm: 'SHA256_DETERMINISTIC',
    hash: 'd0a1b2c3f4e5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1',
    isVerified: true,
    houseFee: 425
  }
]

export function RecentSweepstakes() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="recent-sweepstakes-card">
        <CardHeader className="recent-sweepstakes-header">
          <CardTitle className="recent-sweepstakes-title">
            <Trophy className="w-5 h-5 text-chronos-gold" />
            Sorteios Recentes
          </CardTitle>
          <p className="recent-sweepstakes-subtitle">
            Últimos sorteios executados com dados de auditoria completos
          </p>
        </CardHeader>

        <CardContent className="recent-sweepstakes-content">
          <div className="recent-sweepstakes-list">
            {recentSweepstakes.map((sweepstake, index) => (
              <motion.div
                key={sweepstake.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="sweepstake-audit-item"
              >
                <div className="sweepstake-audit-header">
                  <div className="sweepstake-audit-info">
                    <h3 className="sweepstake-audit-title">
                      {sweepstake.title}
                    </h3>
                    <div className="sweepstake-audit-meta">
                      <span className="sweepstake-audit-time">
                        <Clock className="w-4 h-4" />
                        {formatRelativeTime(sweepstake.executedAt)}
                      </span>
                      <span className="sweepstake-audit-participants">
                        <Users className="w-4 h-4" />
                        {sweepstake.participants.toLocaleString()} participantes
                      </span>
                    </div>
                  </div>
                  
                  <div className="sweepstake-audit-status">
                    {sweepstake.isVerified ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verificado
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        <Clock className="w-3 h-3 mr-1" />
                        Verificando
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="sweepstake-audit-details">
                  <div className="sweepstake-audit-detail">
                    <span className="detail-label">Vencedor:</span>
                    <span className="detail-value">{sweepstake.winner.name}</span>
                  </div>
                  <div className="sweepstake-audit-detail">
                    <span className="detail-label">Prêmio:</span>
                    <span className="detail-value success">
                      {formatCurrency(sweepstake.winner.prize)}
                    </span>
                  </div>
                  <div className="sweepstake-audit-detail">
                    <span className="detail-label">Taxa da Casa:</span>
                    <span className="detail-value">
                      {formatCurrency(sweepstake.houseFee)} (5%)
                    </span>
                  </div>
                  <div className="sweepstake-audit-detail">
                    <span className="detail-label">Algoritmo:</span>
                    <span className="detail-value">{sweepstake.algorithm}</span>
                  </div>
                </div>

                <div className="sweepstake-audit-hash">
                  <div className="hash-label">
                    <Shield className="w-4 h-4" />
                    Hash de Verificação:
                  </div>
                  <div className="hash-value">
                    {sweepstake.hash}
                  </div>
                </div>

                <div className="sweepstake-audit-actions">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/audit/sweepstake/${sweepstake.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Link>
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Prova
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="recent-sweepstakes-footer">
            <Button asChild variant="outline" className="view-all-btn">
              <Link href="/audit/all">
                Ver Todos os Sorteios
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
