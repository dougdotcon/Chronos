'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  Wallet, 
  CreditCard, 
  Smartphone,
  QrCode,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface DepositFormProps {
  user: User
}

const depositMethods = [
  {
    id: 'pix',
    name: 'PIX',
    icon: Smartphone,
    description: 'Transferência instantânea',
    fee: 0,
    minAmount: 10,
    maxAmount: 5000,
    processingTime: 'Instantâneo'
  },
  {
    id: 'credit_card',
    name: 'Cartão de Crédito',
    icon: CreditCard,
    description: 'Visa, Mastercard, Elo',
    fee: 3.99,
    minAmount: 20,
    maxAmount: 2000,
    processingTime: '1-2 minutos'
  },
  {
    id: 'bank_transfer',
    name: 'Transferência Bancária',
    icon: Wallet,
    description: 'TED/DOC',
    fee: 0,
    minAmount: 50,
    maxAmount: 10000,
    processingTime: '1-2 dias úteis'
  }
]

const quickAmounts = [50, 100, 200, 500, 1000]

export function DepositForm({ user }: DepositFormProps) {
  const [selectedMethod, setSelectedMethod] = useState('pix')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const currentMethod = depositMethods.find(m => m.id === selectedMethod)
  const numericAmount = parseFloat(amount) || 0
  const feeAmount = currentMethod ? (numericAmount * currentMethod.fee) / 100 : 0
  const totalAmount = numericAmount + feeAmount
  const chronosAmount = numericAmount // 1 BRL = 1 Chronos

  const handleAmountChange = (value: string) => {
    // Permitir apenas números e ponto decimal
    const cleanValue = value.replace(/[^0-9.]/g, '')
    setAmount(cleanValue)
    setError('')
  }

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString())
    setError('')
  }

  const validateAmount = () => {
    if (!currentMethod) return false
    
    if (numericAmount < currentMethod.minAmount) {
      setError(`Valor mínimo: ${formatCurrency(currentMethod.minAmount)}`)
      return false
    }
    
    if (numericAmount > currentMethod.maxAmount) {
      setError(`Valor máximo: ${formatCurrency(currentMethod.maxAmount)}`)
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateAmount()) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: selectedMethod,
          amount: numericAmount,
          feeAmount,
          totalAmount
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao processar depósito')
      }

      setSuccess(`Depósito de ${formatCurrency(numericAmount)} iniciado com sucesso!`)
      setAmount('')

      // Redirecionar para página de pagamento se necessário
      if (data.paymentUrl) {
        window.open(data.paymentUrl, '_blank')
      }

    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="deposit-form-card">
        <CardHeader className="deposit-form-header">
          <CardTitle className="deposit-form-title">
            <Wallet className="w-6 h-6 text-chronos-gold" />
            Fazer Depósito
          </CardTitle>
          <div className="deposit-balance-info">
            <span className="deposit-balance-label">Saldo atual:</span>
            <span className="deposit-balance-value">
              {formatCurrency(parseFloat(user.chronosBalance || '0'))} Chronos
            </span>
          </div>
        </CardHeader>

        <CardContent className="deposit-form-content">
          <form onSubmit={handleSubmit} className="deposit-form">
            {/* Payment Methods */}
            <div className="deposit-methods">
              <Label className="deposit-section-label">
                Método de Pagamento
              </Label>
              <div className="deposit-methods-grid">
                {depositMethods.map((method) => (
                  <motion.button
                    key={method.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`deposit-method ${
                      selectedMethod === method.id ? 'active' : ''
                    }`}
                  >
                    <method.icon className="deposit-method-icon" />
                    <div className="deposit-method-content">
                      <h4 className="deposit-method-name">
                        {method.name}
                      </h4>
                      <p className="deposit-method-description">
                        {method.description}
                      </p>
                      <div className="deposit-method-details">
                        <span className="deposit-method-fee">
                          Taxa: {method.fee > 0 ? `${method.fee}%` : 'Grátis'}
                        </span>
                        <span className="deposit-method-time">
                          {method.processingTime}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quick Amounts */}
            <div className="deposit-quick-amounts">
              <Label className="deposit-section-label">
                Valores Rápidos
              </Label>
              <div className="deposit-quick-grid">
                {quickAmounts.map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant="outline"
                    onClick={() => handleQuickAmount(value)}
                    className="deposit-quick-btn"
                  >
                    {formatCurrency(value)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="deposit-amount">
              <Label htmlFor="amount" className="deposit-section-label">
                Valor do Depósito
              </Label>
              <div className="deposit-amount-container">
                <Input
                  id="amount"
                  type="text"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="deposit-amount-input"
                  disabled={isLoading}
                />
                <span className="deposit-amount-currency">BRL</span>
              </div>
              {currentMethod && (
                <div className="deposit-amount-limits">
                  Mín: {formatCurrency(currentMethod.minAmount)} • 
                  Máx: {formatCurrency(currentMethod.maxAmount)}
                </div>
              )}
            </div>

            {/* Summary */}
            {numericAmount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="deposit-summary"
              >
                <h4 className="deposit-summary-title">Resumo do Depósito</h4>
                <div className="deposit-summary-rows">
                  <div className="deposit-summary-row">
                    <span>Valor do depósito:</span>
                    <span>{formatCurrency(numericAmount)}</span>
                  </div>
                  {feeAmount > 0 && (
                    <div className="deposit-summary-row">
                      <span>Taxa ({currentMethod?.fee}%):</span>
                      <span>{formatCurrency(feeAmount)}</span>
                    </div>
                  )}
                  <div className="deposit-summary-row total">
                    <span>Total a pagar:</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="deposit-summary-row chronos">
                    <span>Você receberá:</span>
                    <span>{formatCurrency(chronosAmount)} Chronos</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="deposit-message error"
              >
                <AlertCircle className="w-5 h-5" />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="deposit-message success"
              >
                <CheckCircle className="w-5 h-5" />
                {success}
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!numericAmount || numericAmount <= 0 || isLoading}
              className="deposit-submit-btn"
              size="lg"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Processando...
                </>
              ) : (
                <>
                  {selectedMethod === 'pix' && <QrCode className="w-5 h-5 mr-2" />}
                  {selectedMethod === 'credit_card' && <CreditCard className="w-5 h-5 mr-2" />}
                  {selectedMethod === 'bank_transfer' && <Wallet className="w-5 h-5 mr-2" />}
                  Depositar {numericAmount > 0 ? formatCurrency(numericAmount) : ''}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
