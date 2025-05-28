'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Smartphone,
  CreditCard,
  Wallet
} from 'lucide-react'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'

interface TransactionsHistoryProps {
  userId: string
}

interface Transaction {
  id: string
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PRIZE_WIN' | 'SWEEPSTAKE_ENTRY' | 'REFUND'
  amount: number
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED'
  method?: string
  description: string
  createdAt: Date
  processedAt?: Date
  feeAmount?: number
  reference?: string
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: 'txn_001',
    type: 'PRIZE_WIN',
    amount: 23750,
    status: 'COMPLETED',
    description: 'Prêmio do sorteio: Mega Noturno #1247',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    processedAt: new Date(Date.now() - 1000 * 60 * 30),
    reference: 'sweep_001'
  },
  {
    id: 'txn_002',
    type: 'DEPOSIT',
    amount: 100,
    status: 'COMPLETED',
    method: 'PIX',
    description: 'Depósito via PIX',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    processedAt: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 10),
    feeAmount: 0
  },
  {
    id: 'txn_003',
    type: 'SWEEPSTAKE_ENTRY',
    amount: -1.50,
    status: 'COMPLETED',
    description: 'Entrada no sorteio: Mega Noturno #1247',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    processedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    reference: 'sweep_001'
  },
  {
    id: 'txn_004',
    type: 'DEPOSIT',
    amount: 50,
    status: 'FAILED',
    method: 'CREDIT_CARD',
    description: 'Depósito via Cartão de Crédito',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    feeAmount: 2.00
  },
  {
    id: 'txn_005',
    type: 'SWEEPSTAKE_ENTRY',
    amount: -450,
    status: 'COMPLETED',
    description: 'Entrada no sorteio: Duelo X1 #892',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    processedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    reference: 'sweep_002'
  },
  {
    id: 'txn_006',
    type: 'REFUND',
    amount: 150,
    status: 'COMPLETED',
    description: 'Reembolso: Sorteio cancelado #445',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    processedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    reference: 'sweep_003'
  }
]

const getTransactionIcon = (type: string, method?: string) => {
  if (method) {
    switch (method) {
      case 'PIX':
        return <Smartphone className="w-4 h-4" />
      case 'CREDIT_CARD':
        return <CreditCard className="w-4 h-4" />
      case 'BANK_TRANSFER':
        return <Wallet className="w-4 h-4" />
    }
  }

  switch (type) {
    case 'DEPOSIT':
    case 'PRIZE_WIN':
    case 'REFUND':
      return <TrendingUp className="w-4 h-4" />
    case 'WITHDRAWAL':
    case 'SWEEPSTAKE_ENTRY':
      return <TrendingDown className="w-4 h-4" />
    default:
      return <DollarSign className="w-4 h-4" />
  }
}

const getTransactionColor = (type: string, amount: number) => {
  if (amount > 0) return 'text-green-400'
  if (amount < 0) return 'text-red-400'
  return 'text-gray-400'
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
          Cancelado
        </Badge>
      )
    default:
      return null
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'DEPOSIT':
      return 'Depósito'
    case 'WITHDRAWAL':
      return 'Saque'
    case 'PRIZE_WIN':
      return 'Prêmio'
    case 'SWEEPSTAKE_ENTRY':
      return 'Entrada'
    case 'REFUND':
      return 'Reembolso'
    default:
      return type
  }
}

export function TransactionsHistory({ userId }: TransactionsHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'deposits' | 'withdrawals' | 'prizes' | 'entries'>('all')

  const filteredTransactions = mockTransactions.filter(transaction => {
    switch (filter) {
      case 'deposits':
        return transaction.type === 'DEPOSIT'
      case 'withdrawals':
        return transaction.type === 'WITHDRAWAL'
      case 'prizes':
        return transaction.type === 'PRIZE_WIN'
      case 'entries':
        return transaction.type === 'SWEEPSTAKE_ENTRY'
      default:
        return true
    }
  })

  const totalIn = mockTransactions
    .filter(t => t.amount > 0 && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalOut = mockTransactions
    .filter(t => t.amount < 0 && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="transactions-history"
    >
      {/* Summary */}
      <div className="transactions-history-summary">
        <div className="summary-stat">
          <span className="summary-stat-value success">
            {formatCurrency(totalIn)}
          </span>
          <span className="summary-stat-label">Total recebido</span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat-value danger">
            {formatCurrency(totalOut)}
          </span>
          <span className="summary-stat-label">Total gasto</span>
        </div>
        <div className="summary-stat">
          <span className={`summary-stat-value ${totalIn > totalOut ? 'success' : 'danger'}`}>
            {formatCurrency(totalIn - totalOut)}
          </span>
          <span className="summary-stat-label">Saldo líquido</span>
        </div>
      </div>

      {/* Filters */}
      <div className="transactions-history-filters">
        <button
          onClick={() => setFilter('all')}
          className={`history-filter ${filter === 'all' ? 'active' : ''}`}
        >
          Todas ({mockTransactions.length})
        </button>
        <button
          onClick={() => setFilter('deposits')}
          className={`history-filter ${filter === 'deposits' ? 'active' : ''}`}
        >
          Depósitos ({mockTransactions.filter(t => t.type === 'DEPOSIT').length})
        </button>
        <button
          onClick={() => setFilter('prizes')}
          className={`history-filter ${filter === 'prizes' ? 'active' : ''}`}
        >
          Prêmios ({mockTransactions.filter(t => t.type === 'PRIZE_WIN').length})
        </button>
        <button
          onClick={() => setFilter('entries')}
          className={`history-filter ${filter === 'entries' ? 'active' : ''}`}
        >
          Entradas ({mockTransactions.filter(t => t.type === 'SWEEPSTAKE_ENTRY').length})
        </button>
      </div>

      {/* List */}
      <div className="transactions-history-list">
        {filteredTransactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className={`transaction-history-item ${transaction.status.toLowerCase()}`}>
              <CardContent className="transaction-history-content">
                <div className="transaction-history-header">
                  <div className="transaction-history-info">
                    <div className="transaction-history-main">
                      <div className={`transaction-history-icon ${getTransactionColor(transaction.type, transaction.amount)}`}>
                        {getTransactionIcon(transaction.type, transaction.method)}
                      </div>
                      <div className="transaction-history-details">
                        <h3 className="transaction-history-description">
                          {transaction.description}
                        </h3>
                        <div className="transaction-history-meta">
                          <span className="transaction-type">
                            {getTypeLabel(transaction.type)}
                          </span>
                          {transaction.method && (
                            <span className="transaction-method">
                              • {transaction.method.replace('_', ' ')}
                            </span>
                          )}
                          <span className="transaction-time">
                            • {formatRelativeTime(transaction.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="transaction-history-amount">
                      <span className={`transaction-amount ${getTransactionColor(transaction.type, transaction.amount)}`}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                      </span>
                      {transaction.feeAmount && transaction.feeAmount > 0 && (
                        <span className="transaction-fee">
                          Taxa: {formatCurrency(transaction.feeAmount)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="transaction-history-status">
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>

                {transaction.processedAt && (
                  <div className="transaction-history-processed">
                    <Clock className="w-3 h-3" />
                    <span>
                      Processado em {formatRelativeTime(transaction.processedAt)}
                    </span>
                  </div>
                )}

                {transaction.reference && (
                  <div className="transaction-history-reference">
                    <span className="reference-label">Referência:</span>
                    <span className="reference-value">#{transaction.reference}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <div className="transactions-history-load-more">
        <Button variant="outline">
          Carregar Mais Transações
        </Button>
      </div>
    </motion.div>
  )
}
