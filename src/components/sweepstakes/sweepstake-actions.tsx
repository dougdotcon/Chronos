'use client'

import { motion } from 'framer-motion'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  Play, 
  LogOut, 
  Wallet, 
  Trophy,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface SweepstakeActionsProps {
  sweepstake: {
    id: string
    title: string
    entryFee: number
    prizePool: number
    isParticipating: boolean
    canParticipate: boolean
    status: string
  }
  user: User
  isLoading: boolean
  onJoin: () => void
  onLeave: () => void
}

export function SweepstakeActions({ 
  sweepstake, 
  user, 
  isLoading, 
  onJoin, 
  onLeave 
}: SweepstakeActionsProps) {
  const userBalance = parseFloat(user.chronosBalance || '0')
  const hasEnoughBalance = userBalance >= sweepstake.entryFee
  const canJoin = sweepstake.canParticipate && !sweepstake.isParticipating && hasEnoughBalance
  const canLeave = sweepstake.isParticipating && sweepstake.status === 'ACTIVE'

  return (
    <div className="sweepstake-actions">
      <Card className="sweepstake-actions-card">
        <CardHeader className="sweepstake-actions-header">
          <CardTitle className="sweepstake-actions-title">
            <Trophy className="w-5 h-5 text-chronos-gold" />
            Participar do Sorteio
          </CardTitle>
        </CardHeader>

        <CardContent className="sweepstake-actions-content">
          {/* User Balance */}
          <div className="sweepstake-balance-info">
            <div className="sweepstake-balance-row">
              <Wallet className="w-4 h-4 text-chronos-gold" />
              <span className="sweepstake-balance-label">Seu saldo:</span>
              <span className="sweepstake-balance-value">
                {formatCurrency(userBalance)} Chronos
              </span>
            </div>
            
            <div className="sweepstake-balance-row">
              <Trophy className="w-4 h-4 text-green-400" />
              <span className="sweepstake-balance-label">Entrada necessária:</span>
              <span className="sweepstake-balance-value">
                {sweepstake.entryFee > 0 ? `${formatCurrency(sweepstake.entryFee)} Chronos` : 'Gratuito'}
              </span>
            </div>
          </div>

          {/* Status Messages */}
          {sweepstake.isParticipating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="sweepstake-status-message success"
            >
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <h4>Você está participando!</h4>
                <p>Boa sorte! O resultado será anunciado em breve.</p>
              </div>
            </motion.div>
          )}

          {!hasEnoughBalance && !sweepstake.isParticipating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="sweepstake-status-message warning"
            >
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <div>
                <h4>Saldo insuficiente</h4>
                <p>Você precisa de mais {formatCurrency(sweepstake.entryFee - userBalance)} Chronos para participar.</p>
              </div>
            </motion.div>
          )}

          {!sweepstake.canParticipate && !sweepstake.isParticipating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="sweepstake-status-message error"
            >
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <div>
                <h4>Não é possível participar</h4>
                <p>Este sorteio não está mais aceitando participantes.</p>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="sweepstake-action-buttons">
            {!sweepstake.isParticipating ? (
              <Button
                onClick={onJoin}
                disabled={!canJoin || isLoading}
                className="sweepstake-join-btn"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Participando...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    {sweepstake.entryFee > 0 ? `Participar por ${formatCurrency(sweepstake.entryFee)}` : 'Participar Grátis'}
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={onLeave}
                disabled={!canLeave || isLoading}
                variant="outline"
                className="sweepstake-leave-btn"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Saindo...
                  </>
                ) : (
                  <>
                    <LogOut className="w-5 h-5 mr-2" />
                    Sair do Sorteio
                  </>
                )}
              </Button>
            )}

            {!hasEnoughBalance && (
              <Button
                asChild
                variant="outline"
                className="sweepstake-deposit-btn"
                size="lg"
              >
                <a href="/deposit">
                  <Wallet className="w-5 h-5 mr-2" />
                  Depositar Chronos
                </a>
              </Button>
            )}
          </div>

          {/* Prize Info */}
          <div className="sweepstake-prize-info">
            <h4 className="sweepstake-prize-title">
              Prêmio Potencial
            </h4>
            <div className="sweepstake-prize-amount">
              {formatCurrency(sweepstake.prizePool)}
            </div>
            <p className="sweepstake-prize-description">
              O vencedor leva todo o prêmio acumulado
            </p>
          </div>

          {/* Terms */}
          <div className="sweepstake-terms">
            <p className="sweepstake-terms-text">
              Ao participar, você concorda com os{' '}
              <a href="/terms" className="sweepstake-terms-link">
                Termos de Uso
              </a>{' '}
              e{' '}
              <a href="/rules" className="sweepstake-terms-link">
                Regras do Sorteio
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
