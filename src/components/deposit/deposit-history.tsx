'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  History, 
  CreditCard, 
  Smartphone, 
  Wallet,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw
} from 'lucide-react'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'

interface DepositHistoryProps {
  userId: string
}

interface DepositTransaction {
  id: string
  amount: number
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  paymentMethod: string
  createdAt: Date
  processedAt?: Date
  feeAmount?: number
  totalAmount?: number
}

// Mock data - em produção viria da API
const mockDeposits: DepositTransaction[] = [
  {
    id: 'dep_001',
    amount: 100.00,
    status: 'COMPLETED',
    paymentMethod: 'PIX',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    processedAt: new Date(Date.now() - 1000 * 60 * 29),
    feeAmount: 0,
    totalAmount: 100.00
  },
  {
    id: 'dep_002',
    amount: 50.00,
    status: 'COMPLETED',
    paymentMethod: 'CREDIT_CARD',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    processedAt: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 2),
    feeAmount: 2.00,
    totalAmount: 52.00
  },
  {
    id: 'dep_003',
    amount: 200.00,
    status: 'PENDING',
    paymentMethod: 'BANK_TRANSFER',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    feeAmount: 0,
    totalAmount: 200.00
  },
  {
    id: 'dep_004',
    amount: 25.00,
    status: 'FAILED',
    paymentMethod: 'CREDIT_CARD',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    feeAmount: 1.00,
    totalAmount: 26.00
  }
]

const getPaymentMethodIcon = (method: string) => {
  switch (method) {
    case 'PIX':
      return <Smartphone className="w-4 h-4" />
    case 'CREDIT_CARD':
      return <CreditCard className="w-4 h-4" />
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
    default:
      return <Badge variant="outline">Desconhecido</Badge>
  }
}

export function DepositHistory({ userId }: DepositHistoryProps) {
  const [deposits, setDeposits] = useState<DepositTransaction[]>(mockDeposits)
  const [isLoading, setIsLoading] = useState(false)

  const loadDeposits = async () => {
    setIsLoading(true)
    try {
      // Simular carregamento da API
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Em produção: const response = await fetch('/api/deposit')
      setDeposits(mockDeposits)
    } catch (error) {
      console.error('Erro ao carregar depósitos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDeposits()
  }, [userId])

  const totalDeposited = deposits
    .filter(d => d.status === 'COMPLETED')
    .reduce((sum, d) => sum + d.amount, 0)

  const pendingAmount = deposits
    .filter(d => d.status === 'PENDING')
    .reduce((sum, d) => sum + d.amount, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="deposit-history-card">
        <CardHeader className="deposit-history-header">
          <div className="deposit-history-title-row">
            <CardTitle className="deposit-history-title">
              <History className="w-5 h-5 text-chronos-gold" />
              Histórico de Depósitos
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={loadDeposits}
              disabled={isLoading}
              className="deposit-history-refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="deposit-history-content">
          {/* Summary */}
          <div className="deposit-history-summary">
            <div className="deposit-summary-item">
              <span className="deposit-summary-label">Total Depositado:</span>
              <span className="deposit-summary-value success">
                {formatCurrency(totalDeposited)}
              </span>
            </div>
            {pendingAmount > 0 && (
              <div className="deposit-summary-item">
                <span className="deposit-summary-label">Pendente:</span>
                <span className="deposit-summary-value warning">
                  {formatCurrency(pendingAmount)}
                </span>
              </div>
            )}
          </div>

          {/* Transactions List */}
          <div className="deposit-history-list">
            {deposits.length === 0 ? (
              <div className="deposit-history-empty">
                <History className="deposit-history-empty-icon" />
                <h4>Nenhum depósito encontrado</h4>
                <p>Seus depósitos aparecerão aqui</p>
              </div>
            ) : (
              deposits.map((deposit, index) => (
                <motion.div
                  key={deposit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="deposit-history-item"
                >
                  <div className="deposit-item-icon">
                    {getPaymentMethodIcon(deposit.paymentMethod)}
                  </div>

                  <div className="deposit-item-content">
                    <div className="deposit-item-header">
                      <span className="deposit-item-method">
                        {deposit.paymentMethod.replace('_', ' ')}
                      </span>
                      {getStatusBadge(deposit.status)}
                    </div>
                    
                    <div className="deposit-item-details">
                      <span className="deposit-item-amount">
                        {formatCurrency(deposit.amount)}
                      </span>
                      {deposit.feeAmount && deposit.feeAmount > 0 && (
                        <span className="deposit-item-fee">
                          Taxa: {formatCurrency(deposit.feeAmount)}
                        </span>
                      )}
                    </div>

                    <div className="deposit-item-time">
                      {formatRelativeTime(deposit.createdAt)}
                      {deposit.processedAt && (
                        <span className="deposit-item-processed">
                          • Processado {formatRelativeTime(deposit.processedAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="deposit-item-id">
                    #{deposit.id.slice(-6)}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Load More */}
          {deposits.length > 0 && (
            <div className="deposit-history-load-more">
              <Button
                variant="outline"
                size="sm"
                className="deposit-load-more-btn"
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
