'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  Smartphone, 
  Wallet,
  Shield,
  Clock,
  Zap
} from 'lucide-react'

const paymentMethods = [
  {
    id: 'pix',
    name: 'PIX',
    icon: Smartphone,
    description: 'Transferência instantânea 24/7',
    fee: 'Grátis',
    time: 'Instantâneo',
    limits: 'R$ 10 - R$ 5.000',
    features: ['Disponível 24/7', 'Sem taxas', 'Confirmação automática'],
    color: 'text-green-400',
    bgColor: 'bg-green-400/10'
  },
  {
    id: 'credit_card',
    name: 'Cartão de Crédito',
    icon: CreditCard,
    description: 'Visa, Mastercard, Elo',
    fee: '3,99%',
    time: '1-2 minutos',
    limits: 'R$ 20 - R$ 2.000',
    features: ['Parcelamento disponível', 'Segurança SSL', 'Aprovação rápida'],
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10'
  },
  {
    id: 'bank_transfer',
    name: 'Transferência Bancária',
    icon: Wallet,
    description: 'TED/DOC tradicional',
    fee: 'Grátis',
    time: '1-2 dias úteis',
    limits: 'R$ 50 - R$ 10.000',
    features: ['Maiores valores', 'Sem taxas', 'Comprovante necessário'],
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10'
  }
]

export function DepositMethods() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="deposit-methods-card">
        <CardHeader className="deposit-methods-header">
          <CardTitle className="deposit-methods-title">
            <Shield className="w-5 h-5 text-chronos-gold" />
            Métodos de Pagamento
          </CardTitle>
        </CardHeader>

        <CardContent className="deposit-methods-content">
          <div className="deposit-methods-list">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className={`deposit-method-card ${method.bgColor}`}
              >
                <div className="deposit-method-header">
                  <div className={`deposit-method-icon ${method.color}`}>
                    <method.icon className="w-6 h-6" />
                  </div>
                  <div className="deposit-method-info">
                    <h4 className="deposit-method-name">
                      {method.name}
                    </h4>
                    <p className="deposit-method-description">
                      {method.description}
                    </p>
                  </div>
                </div>

                <div className="deposit-method-details">
                  <div className="deposit-method-detail">
                    <Clock className="w-4 h-4" />
                    <span>{method.time}</span>
                  </div>
                  <div className="deposit-method-detail">
                    <Wallet className="w-4 h-4" />
                    <span>{method.limits}</span>
                  </div>
                  <div className="deposit-method-detail">
                    <Zap className="w-4 h-4" />
                    <Badge variant="outline" className="deposit-method-fee">
                      {method.fee}
                    </Badge>
                  </div>
                </div>

                <div className="deposit-method-features">
                  {method.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="deposit-method-feature">
                      <div className="deposit-method-feature-dot" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Security Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="deposit-security-info"
          >
            <div className="deposit-security-header">
              <Shield className="w-5 h-5 text-green-400" />
              <h4>Segurança Garantida</h4>
            </div>
            <div className="deposit-security-features">
              <div className="deposit-security-feature">
                <div className="deposit-security-feature-icon">🔒</div>
                <span>Criptografia SSL 256-bit</span>
              </div>
              <div className="deposit-security-feature">
                <div className="deposit-security-feature-icon">🛡️</div>
                <span>Conformidade PCI DSS</span>
              </div>
              <div className="deposit-security-feature">
                <div className="deposit-security-feature-icon">✅</div>
                <span>Auditoria independente</span>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
