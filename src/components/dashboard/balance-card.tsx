'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, Plus, Minus, TrendingUp, Eye, EyeOff } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useState } from 'react'

interface BalanceCardProps {
  balance: string
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true)
  const numericBalance = parseFloat(balance)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <Card className="balance-card">
        <CardHeader className="balance-card-header">
          <div className="balance-card-title-row">
            <CardTitle className="balance-card-title">
              <Wallet className="balance-card-icon" />
              Saldo Chronos
            </CardTitle>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="balance-toggle"
            >
              {showBalance ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
        </CardHeader>

        <CardContent className="balance-card-content">
          <div className="balance-amount">
            {showBalance ? (
              <span className="balance-value">
                {formatCurrency(numericBalance)} Chronos
              </span>
            ) : (
              <span className="balance-hidden">
                ••••• Chronos
              </span>
            )}
          </div>

          <div className="balance-trend">
            <TrendingUp className="balance-trend-icon" />
            <span className="balance-trend-text">
              +12.5% este mês
            </span>
          </div>

          <div className="balance-actions">
            <Button asChild className="balance-action-btn balance-deposit">
              <Link href="/deposit">
                <Plus className="w-4 h-4" />
                Depositar
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="balance-action-btn balance-withdraw">
              <Link href="/withdraw">
                <Minus className="w-4 h-4" />
                Sacar
              </Link>
            </Button>
          </div>

          <div className="balance-info">
            <p className="balance-info-text">
              💡 Participe de sorteios a partir de 1.50 Chronos
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
