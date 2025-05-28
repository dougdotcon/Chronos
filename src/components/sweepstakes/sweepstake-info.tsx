'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Info, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Award
} from 'lucide-react'

interface SweepstakeInfoProps {
  sweepstake: {
    id: string
    title: string
    description: string
    rules: string[]
    type: string
    prizePool: number
    entryFee: number
  }
}

export function SweepstakeInfo({ sweepstake }: SweepstakeInfoProps) {
  return (
    <div className="sweepstake-info">
      <div className="sweepstake-info-grid">
        {/* Description Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="sweepstake-info-card">
            <CardHeader className="sweepstake-info-card-header">
              <CardTitle className="sweepstake-info-card-title">
                <Info className="w-5 h-5 text-chronos-gold" />
                Sobre o Sorteio
              </CardTitle>
            </CardHeader>
            <CardContent className="sweepstake-info-card-content">
              <p className="sweepstake-info-description">
                {sweepstake.description}
              </p>
              
              <div className="sweepstake-info-features">
                <div className="sweepstake-info-feature">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Algoritmo Verificável</span>
                </div>
                <div className="sweepstake-info-feature">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Resultado Transparente</span>
                </div>
                <div className="sweepstake-info-feature">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span>Pagamento Instantâneo</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rules Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="sweepstake-info-card">
            <CardHeader className="sweepstake-info-card-header">
              <CardTitle className="sweepstake-info-card-title">
                <FileText className="w-5 h-5 text-chronos-gold" />
                Regras do Sorteio
              </CardTitle>
            </CardHeader>
            <CardContent className="sweepstake-info-card-content">
              <div className="sweepstake-info-rules">
                {sweepstake.rules.map((rule, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    className="sweepstake-info-rule"
                  >
                    <div className="sweepstake-info-rule-number">
                      {index + 1}
                    </div>
                    <span className="sweepstake-info-rule-text">
                      {rule}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="sweepstake-info-card">
            <CardHeader className="sweepstake-info-card-header">
              <CardTitle className="sweepstake-info-card-title">
                <Shield className="w-5 h-5 text-green-400" />
                Segurança & Transparência
              </CardTitle>
            </CardHeader>
            <CardContent className="sweepstake-info-card-content">
              <div className="sweepstake-security-features">
                <div className="sweepstake-security-feature">
                  <div className="sweepstake-security-icon">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="sweepstake-security-content">
                    <h4>Algoritmo SHA-256</h4>
                    <p>Resultado gerado por criptografia segura</p>
                  </div>
                </div>

                <div className="sweepstake-security-feature">
                  <div className="sweepstake-security-icon">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="sweepstake-security-content">
                    <h4>Auditoria Pública</h4>
                    <p>Todos os sorteios são auditáveis</p>
                  </div>
                </div>

                <div className="sweepstake-security-feature">
                  <div className="sweepstake-security-icon">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="sweepstake-security-content">
                    <h4>Pagamento Automático</h4>
                    <p>Prêmios creditados instantaneamente</p>
                  </div>
                </div>
              </div>

              <div className="sweepstake-hash-info">
                <div className="sweepstake-hash-label">
                  Hash do Sorteio:
                </div>
                <div className="sweepstake-hash-value">
                  {sweepstake.id}a7f8e9d2c1b0...
                </div>
                <p className="sweepstake-hash-description">
                  Este hash garante que o resultado não pode ser manipulado
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Warning Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="sweepstake-info-card sweepstake-warning-card">
            <CardHeader className="sweepstake-info-card-header">
              <CardTitle className="sweepstake-info-card-title">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                Importante
              </CardTitle>
            </CardHeader>
            <CardContent className="sweepstake-info-card-content">
              <div className="sweepstake-warnings">
                <div className="sweepstake-warning">
                  <Badge variant="outline" className="sweepstake-warning-badge">
                    +18
                  </Badge>
                  <span>Apenas para maiores de 18 anos</span>
                </div>
                
                <div className="sweepstake-warning">
                  <Badge variant="outline" className="sweepstake-warning-badge">
                    Responsável
                  </Badge>
                  <span>Jogue com responsabilidade</span>
                </div>
                
                <div className="sweepstake-warning">
                  <Badge variant="outline" className="sweepstake-warning-badge">
                    Suporte
                  </Badge>
                  <span>Suporte 24/7 disponível</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
