'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  History, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Trophy,
  Plus,
  Minus
} from 'lucide-react'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'

interface RecentTransactionsProps {
  userId: string
}

// Mock data - em produção viria da API
const recentTransactions = [
  {
    id: '1',
    type: 'PRIZE_WIN',
    amount: 450.00,
    status: 'COMPLETED',
    description: 'Prêmio - Duelo X1 #1234',
    createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 min ago
  },
  {
    id: '2',
    type: 'ROOM_ENTRY',
    amount: -16.50,
    status: 'COMPLETED',
    description: 'Entrada - Mega Sorteio Noturno',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2h ago
  },
  {
    id: '3',
    type: 'DEPOSIT',
    amount: 100.00,
    status: 'COMPLETED',
    description: 'Depósito via Pix',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  },
  {
    id: '4',
    type: 'ROOM_ENTRY',
    amount: -8.50,
    status: 'COMPLETED',
    description: 'Entrada - Batalha em Grupo #567',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
  }
]

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'DEPOSIT':
      return <Plus className="w-4 h-4 text-green-400" />
    case 'WITHDRAWAL':
      return <Minus className="w-4 h-4 text-red-400" />
    case 'PRIZE_WIN':
      return <Trophy className="w-4 h-4 text-yellow-400" />
    case 'ROOM_ENTRY':
      return <ArrowUpRight className="w-4 h-4 text-blue-400" />
    default:
      return <History className="w-4 h-4 text-gray-400" />
  }
}

const getTransactionColor = (amount: number) => {
  return amount > 0 ? 'text-green-400' : 'text-red-400'
}

export function RecentTransactions({ userId }: RecentTransactionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="recent-transactions-card">
        <CardHeader className="recent-transactions-header">
          <div className="recent-transactions-title-row">
            <CardTitle className="recent-transactions-title">
              <History className="w-5 h-5 text-chronos-gold" />
              Transações Recentes
            </CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/history">
                Ver Todas
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="recent-transactions-content">
          <div className="transactions-list">
            {recentTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="transaction-item"
              >
                <div className="transaction-icon">
                  {getTransactionIcon(transaction.type)}
                </div>

                <div className="transaction-info">
                  <h4 className="transaction-description">
                    {transaction.description}
                  </h4>
                  <p className="transaction-time">
                    {formatRelativeTime(transaction.createdAt)}
                  </p>
                </div>

                <div className="transaction-amount">
                  <span className={`transaction-value ${getTransactionColor(transaction.amount)}`}>
                    {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                  </span>
                  <Badge 
                    variant={transaction.status === 'COMPLETED' ? 'default' : 'secondary'}
                    className="transaction-status"
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>

          {recentTransactions.length === 0 && (
            <div className="no-transactions">
              <History className="no-transactions-icon" />
              <p className="no-transactions-text">
                Nenhuma transação recente
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
