'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User } from 'next-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowDownToLine, 
  Smartphone, 
  Wallet,
  AlertTriangle,
  CheckCircle,
  DollarSign
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface WithdrawFormProps {
  user: User
}

const withdrawMethods = [
  {
    id: 'pix',
    name: 'PIX',
    icon: Smartphone,
    description: 'Transferência instantânea',
    minAmount: 10,
    maxAmount: 5000,
    fee: 0,
    processingTime: 'Até 1 hora'
  },
  {
    id: 'bank_transfer',
    name: 'Transferência Bancária',
    icon: Wallet,
    description: 'TED/DOC para conta bancária',
    minAmount: 50,
    maxAmount: 10000,
    fee: 0,
    processingTime: '1-2 dias úteis'
  }
]

export function WithdrawForm({ user }: WithdrawFormProps) {
  const [selectedMethod, setSelectedMethod] = useState('')
  const [amount, setAmount] = useState('')
  const [pixKey, setPixKey] = useState('')
  const [bankData, setBankData] = useState({
    bank: '',
    agency: '',
    account: '',
    accountType: '',
    cpf: '',
    name: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Mock user balance
  const userBalance = 1250.75

  const selectedMethodData = withdrawMethods.find(m => m.id === selectedMethod)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!selectedMethod) {
      newErrors.method = 'Selecione um método de saque'
    }

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Digite um valor válido'
    } else if (selectedMethodData) {
      const numAmount = parseFloat(amount)
      if (numAmount < selectedMethodData.minAmount) {
        newErrors.amount = `Valor mínimo: ${formatCurrency(selectedMethodData.minAmount)}`
      }
      if (numAmount > selectedMethodData.maxAmount) {
        newErrors.amount = `Valor máximo: ${formatCurrency(selectedMethodData.maxAmount)}`
      }
      if (numAmount > userBalance) {
        newErrors.amount = 'Saldo insuficiente'
      }
    }

    if (selectedMethod === 'pix' && !pixKey) {
      newErrors.pixKey = 'Digite sua chave PIX'
    }

    if (selectedMethod === 'bank_transfer') {
      if (!bankData.bank) newErrors.bank = 'Selecione o banco'
      if (!bankData.agency) newErrors.agency = 'Digite a agência'
      if (!bankData.account) newErrors.account = 'Digite a conta'
      if (!bankData.accountType) newErrors.accountType = 'Selecione o tipo de conta'
      if (!bankData.cpf) newErrors.cpf = 'Digite o CPF'
      if (!bankData.name) newErrors.name = 'Digite o nome do titular'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const withdrawData = {
        method: selectedMethod,
        amount: parseFloat(amount),
        pixKey: selectedMethod === 'pix' ? pixKey : undefined,
        bankData: selectedMethod === 'bank_transfer' ? bankData : undefined
      }
      
      console.log('Saque solicitado:', withdrawData)
      alert('Saque solicitado com sucesso! Você receberá uma confirmação por email.')
      
      // Reset form
      setAmount('')
      setPixKey('')
      setBankData({
        bank: '',
        agency: '',
        account: '',
        accountType: '',
        cpf: '',
        name: ''
      })
      setSelectedMethod('')
      
    } catch (error) {
      console.error('Erro ao processar saque:', error)
      alert('Erro ao processar saque. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="withdraw-form-card">
        <CardHeader className="withdraw-form-header">
          <CardTitle className="withdraw-form-title">
            <ArrowDownToLine className="w-5 h-5 text-chronos-gold" />
            Solicitar Saque
          </CardTitle>
          <div className="withdraw-balance-info">
            <span className="withdraw-balance-label">Saldo disponível:</span>
            <span className="withdraw-balance-value">
              {formatCurrency(userBalance)}
            </span>
          </div>
        </CardHeader>

        <CardContent className="withdraw-form-content">
          <form onSubmit={handleSubmit} className="withdraw-form">
            {/* Method Selection */}
            <div className="form-group">
              <Label htmlFor="method">Método de Saque</Label>
              <div className="withdraw-methods-grid">
                {withdrawMethods.map((method, index) => (
                  <motion.button
                    key={method.id}
                    type="button"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`withdraw-method-option ${selectedMethod === method.id ? 'selected' : ''}`}
                  >
                    <div className="withdraw-method-icon">
                      <method.icon className="w-5 h-5" />
                    </div>
                    <div className="withdraw-method-info">
                      <h4>{method.name}</h4>
                      <p>{method.description}</p>
                      <div className="withdraw-method-details">
                        <span>Min: {formatCurrency(method.minAmount)}</span>
                        <span>Max: {formatCurrency(method.maxAmount)}</span>
                        <span>{method.processingTime}</span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              {errors.method && (
                <span className="form-error">{errors.method}</span>
              )}
            </div>

            {/* Amount */}
            {selectedMethod && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="form-group"
              >
                <Label htmlFor="amount">Valor do Saque</Label>
                <div className="amount-input-container">
                  <DollarSign className="amount-input-icon" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min={selectedMethodData?.minAmount}
                    max={Math.min(selectedMethodData?.maxAmount || 0, userBalance)}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                    className="amount-input"
                  />
                </div>
                {selectedMethodData && (
                  <div className="amount-info">
                    <span>Mín: {formatCurrency(selectedMethodData.minAmount)}</span>
                    <span>Máx: {formatCurrency(Math.min(selectedMethodData.maxAmount, userBalance))}</span>
                    <span>Taxa: {selectedMethodData.fee > 0 ? formatCurrency(selectedMethodData.fee) : 'Grátis'}</span>
                  </div>
                )}
                {errors.amount && (
                  <span className="form-error">{errors.amount}</span>
                )}
              </motion.div>
            )}

            {/* PIX Key */}
            {selectedMethod === 'pix' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="form-group"
              >
                <Label htmlFor="pixKey">Chave PIX</Label>
                <Input
                  id="pixKey"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder="Digite sua chave PIX (CPF, email, telefone ou chave aleatória)"
                  className="form-input"
                />
                {errors.pixKey && (
                  <span className="form-error">{errors.pixKey}</span>
                )}
              </motion.div>
            )}

            {/* Bank Data */}
            {selectedMethod === 'bank_transfer' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bank-data-section"
              >
                <h4 className="bank-data-title">Dados Bancários</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <Label htmlFor="bank">Banco</Label>
                    <Select value={bankData.bank} onValueChange={(value) => setBankData(prev => ({ ...prev, bank: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o banco" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="001">Banco do Brasil</SelectItem>
                        <SelectItem value="104">Caixa Econômica</SelectItem>
                        <SelectItem value="341">Itaú</SelectItem>
                        <SelectItem value="033">Santander</SelectItem>
                        <SelectItem value="237">Bradesco</SelectItem>
                        <SelectItem value="260">Nu Pagamentos</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.bank && <span className="form-error">{errors.bank}</span>}
                  </div>

                  <div className="form-group">
                    <Label htmlFor="accountType">Tipo de Conta</Label>
                    <Select value={bankData.accountType} onValueChange={(value) => setBankData(prev => ({ ...prev, accountType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corrente">Conta Corrente</SelectItem>
                        <SelectItem value="poupanca">Poupança</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.accountType && <span className="form-error">{errors.accountType}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <Label htmlFor="agency">Agência</Label>
                    <Input
                      id="agency"
                      value={bankData.agency}
                      onChange={(e) => setBankData(prev => ({ ...prev, agency: e.target.value }))}
                      placeholder="0000"
                      className="form-input"
                    />
                    {errors.agency && <span className="form-error">{errors.agency}</span>}
                  </div>

                  <div className="form-group">
                    <Label htmlFor="account">Conta</Label>
                    <Input
                      id="account"
                      value={bankData.account}
                      onChange={(e) => setBankData(prev => ({ ...prev, account: e.target.value }))}
                      placeholder="00000-0"
                      className="form-input"
                    />
                    {errors.account && <span className="form-error">{errors.account}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <Label htmlFor="cpf">CPF do Titular</Label>
                    <Input
                      id="cpf"
                      value={bankData.cpf}
                      onChange={(e) => setBankData(prev => ({ ...prev, cpf: e.target.value }))}
                      placeholder="000.000.000-00"
                      className="form-input"
                    />
                    {errors.cpf && <span className="form-error">{errors.cpf}</span>}
                  </div>

                  <div className="form-group">
                    <Label htmlFor="name">Nome do Titular</Label>
                    <Input
                      id="name"
                      value={bankData.name}
                      onChange={(e) => setBankData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome completo"
                      className="form-input"
                    />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Summary */}
            {selectedMethod && amount && parseFloat(amount) > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="withdraw-summary"
              >
                <h4 className="withdraw-summary-title">Resumo do Saque</h4>
                <div className="withdraw-summary-details">
                  <div className="summary-row">
                    <span>Valor solicitado:</span>
                    <span>{formatCurrency(parseFloat(amount))}</span>
                  </div>
                  <div className="summary-row">
                    <span>Taxa:</span>
                    <span>{selectedMethodData?.fee ? formatCurrency(selectedMethodData.fee) : 'Grátis'}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Valor a receber:</span>
                    <span>{formatCurrency(parseFloat(amount) - (selectedMethodData?.fee || 0))}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tempo de processamento:</span>
                    <span>{selectedMethodData?.processingTime}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!selectedMethod || !amount || parseFloat(amount) <= 0 || isSubmitting}
              className="withdraw-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner" />
                  Processando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Solicitar Saque
                </>
              )}
            </Button>

            {/* Warning */}
            <div className="withdraw-warning">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span>
                Saques estão sujeitos a verificação de identidade e podem levar até 24h para processamento.
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
