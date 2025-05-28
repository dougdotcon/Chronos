'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  History, 
  Smartphone, 
  Wallet,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'

interface WithdrawHistoryProps {
  userId: string
}

interface WithdrawTransaction {
  id: string
  amount: number
  fee: number
  netAmount: number
  method: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  createdAt: Date
  processedAt?: Date
  destination: string
  reference?: string
  failureReason?: string
}

// Mock data
const mockWithdrawals: WithdrawTransaction[] = [
  {
    id: 'wd_001',
    amount: 500.00,
    fee: 0,
    netAmount: 500.00,
    method: 'PIX',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    processedAt: new Date(Date.now() - 1000 * 60 * 60 * 23),
    destination: '***.***.***-12',
    reference: 'PIX_001'
  },
  {
    id: 'wd_002',
    amount: 1000.00,
    fee: 0,
    netAmount: 1000.00,
    method: 'BANK_TRANSFER',
    status: 'PROCESSING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    destination: 'Banco do Brasil - Ag: 1234',
    reference: 'TED_002'
  },
  {
    id: 'wd_003',
    amount: 250.00,
    fee: 0,
    netAmount: 250.00,
    method: 'PIX',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    destination: 'usuario@email.com'
  },
  {
    id: 'wd_004',
    amount: 750.00,
    fee: 0,
    netAmount: 750.00,
    method: 'PIX',
    status: 'FAILED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    destination: '(11) 99999-9999',
    failureReason: 'Chave PIX inválida'
  }
]

const getMethodIcon = (method: string) => {
  switch (method) {
    case 'PIX':
      return <Smartphone className="w-4 h-4" />
    case 'BANK_TRANSFER':
      return <Wallet className="w-4 h-4" />
    default:
      return <Wallet className="w-4 h-4" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          <CheckCircle className="w-3 h-3 mr-1" />
          Concluído
        </Badge>
      )
    case 'PROCESSING':
      return (
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          <RefreshCw className="w-3 h-3 mr-1" />
          Processando
        </Badge>
      )
    case 'PENDING':
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          <Clock className="w-3 h-3 mr-1" />
          Pendente
        </Badge>
      )
    case 'FAILED':
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          <XCircle className="w-3 h-3 mr-1" />
          Falhou
        </Badge>
      )
    case 'CANCELLED':
      return (
        <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelado
        </Badge>
      )
    default:
      return null
  }
}

export function WithdrawHistory({ userId }: WithdrawHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all')
  const [isLoading, setIsLoading] = useState(false)

  const filteredWithdrawals = mockWithdrawals.filter(withdrawal => {
    switch (filter) {
      case 'pending':
        return ['PENDING', 'PROCESSING'].includes(withdrawal.status)
      case 'completed':
        return withdrawal.status === 'COMPLETED'
      case 'failed':
        return ['FAILED', 'CANCELLED'].includes(withdrawal.status)
      default:
        return true
    }
  })

  const totalWithdrawn = mockWithdrawals
    .filter(w => w.status === 'COMPLETED')
    .reduce((sum, w) => sum + w.netAmount, 0)

  const pendingAmount = mockWithdrawals
    .filter(w => ['PENDING', 'PROCESSING'].includes(w.status))
    .reduce((sum, w) => sum + w.netAmount, 0)

  const loadWithdrawals = async () => {
    setIsLoading(true)
    try {
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Erro ao carregar saques:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Card className="withdraw-history-card">
        <CardHeader className="withdraw-history-header">
          <div className="withdraw-history-title-row">
            <CardTitle className="withdraw-history-title">
              <History className="w-5 h-5 text-chronos-gold" />
              Histórico de Saques
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={loadWithdrawals}
              disabled={isLoading}
              className="withdraw-history-refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="withdraw-history-content">
          {/* Summary */}
          <div className="withdraw-history-summary">
            <div className="withdraw-summary-item">
              <span className="withdraw-summary-label">Total Sacado:</span>
              <span className="withdraw-summary-value success">
                {formatCurrency(totalWithdrawn)}
              </span>
            </div>
            {pendingAmount > 0 && (
              <div className="withdraw-summary-item">
                <span className="withdraw-summary-label">Em Processamento:</span>
                <span className="withdraw-summary-value warning">
                  {formatCurrency(pendingAmount)}
                </span>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="withdraw-history-filters">
            <button
              onClick={() => setFilter('all')}
              className={`withdraw-filter ${filter === 'all' ? 'active' : ''}`}
            >
              Todos ({mockWithdrawals.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`withdraw-filter ${filter === 'pending' ? 'active' : ''}`}
            >
              Pendentes ({mockWithdrawals.filter(w => ['PENDING', 'PROCESSING'].includes(w.status)).length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`withdraw-filter ${filter === 'completed' ? 'active' : ''}`}
            >
              Concluídos ({mockWithdrawals.filter(w => w.status === 'COMPLETED').length})
            </button>
            <button
              onClick={() => setFilter('failed')}
              className={`withdraw-filter ${filter === 'failed' ? 'active' : ''}`}
            >
              Falhas ({mockWithdrawals.filter(w => ['FAILED', 'CANCELLED'].includes(w.status)).length})
            </button>
          </div>

          {/* Transactions List */}
          <div className="withdraw-history-list">
            {filteredWithdrawals.length === 0 ? (
              <div className="withdraw-history-empty">
                <History className="withdraw-history-empty-icon" />
                <h4>Nenhum saque encontrado</h4>
                <p>Seus saques aparecerão aqui</p>
              </div>
            ) : (
              filteredWithdrawals.map((withdrawal, index) => (
                <motion.div
                  key={withdrawal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="withdraw-history-item"
                >
                  <div className="withdraw-item-icon">
                    {getMethodIcon(withdrawal.method)}
                  </div>

                  <div className="withdraw-item-content">
                    <div className="withdraw-item-header">
                      <span className="withdraw-item-method">
                        {withdrawal.method === 'PIX' ? 'PIX' : 'Transferência Bancária'}
                      </span>
                      {getStatusBadge(withdrawal.status)}
                    </div>
                    
                    <div className="withdraw-item-details">
                      <span className="withdraw-item-amount">
                        {formatCurrency(withdrawal.netAmount)}
                      </span>
                      {withdrawal.fee > 0 && (
                        <span className="withdraw-item-fee">
                          Taxa: {formatCurrency(withdrawal.fee)}
                        </span>
                      )}
                    </div>

                    <div className="withdraw-item-destination">
                      <span className="destination-label">Destino:</span>
                      <span className="destination-value">{withdrawal.destination}</span>
                    </div>

                    <div className="withdraw-item-time">
                      Solicitado {formatRelativeTime(withdrawal.createdAt)}
                      {withdrawal.processedAt && (
                        <span className="withdraw-item-processed">
                          • Processado {formatRelativeTime(withdrawal.processedAt)}
                        </span>
                      )}
                    </div>

                    {withdrawal.failureReason && (
                      <div className="withdraw-item-error">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{withdrawal.failureReason}</span>
                      </div>
                    )}

                    {withdrawal.reference && (
                      <div className="withdraw-item-reference">
                        <span className="reference-label">Referência:</span>
                        <span className="reference-value">#{withdrawal.reference}</span>
                      </div>
                    )}
                  </div>

                  <div className="withdraw-item-id">
                    #{withdrawal.id.slice(-6)}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Load More */}
          {filteredWithdrawals.length > 0 && (
            <div className="withdraw-history-load-more">
              <Button
                variant="outline"
                size="sm"
                className="withdraw-load-more-btn"
              >
                Carregar Mais
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
