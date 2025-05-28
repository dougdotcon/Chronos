'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Info, 
  Shield, 
  Clock,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  FileText
} from 'lucide-react'

const withdrawLimits = [
  {
    method: 'PIX',
    min: 10,
    max: 5000,
    daily: 5000,
    monthly: 50000
  },
  {
    method: 'Transferência Bancária',
    min: 50,
    max: 10000,
    daily: 10000,
    monthly: 100000
  }
]

const processingTimes = [
  {
    method: 'PIX',
    time: 'Até 1 hora',
    description: 'Processamento automático'
  },
  {
    method: 'Transferência Bancária',
    time: '1-2 dias úteis',
    description: 'Verificação manual necessária'
  }
]

const requirements = [
  {
    title: 'Verificação de Identidade',
    description: 'CPF e dados pessoais verificados',
    status: 'required'
  },
  {
    title: 'Conta Verificada',
    description: 'Email confirmado e conta ativa',
    status: 'required'
  },
  {
    title: 'Saldo Disponível',
    description: 'Fundos não bloqueados ou em disputa',
    status: 'required'
  },
  {
    title: 'Limite Diário',
    description: 'Respeitar limites por método',
    status: 'info'
  }
]

export function WithdrawInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="withdraw-info"
    >
      {/* Limits Card */}
      <Card className="withdraw-info-card">
        <CardHeader className="withdraw-info-header">
          <CardTitle className="withdraw-info-title">
            <DollarSign className="w-5 h-5 text-chronos-gold" />
            Limites de Saque
          </CardTitle>
        </CardHeader>

        <CardContent className="withdraw-info-content">
          <div className="withdraw-limits-list">
            {withdrawLimits.map((limit, index) => (
              <motion.div
                key={limit.method}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="withdraw-limit-item"
              >
                <h4 className="withdraw-limit-method">{limit.method}</h4>
                <div className="withdraw-limit-details">
                  <div className="limit-detail">
                    <span className="limit-label">Mínimo:</span>
                    <span className="limit-value">R$ {limit.min.toFixed(2)}</span>
                  </div>
                  <div className="limit-detail">
                    <span className="limit-label">Máximo:</span>
                    <span className="limit-value">R$ {limit.max.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="limit-detail">
                    <span className="limit-label">Diário:</span>
                    <span className="limit-value">R$ {limit.daily.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="limit-detail">
                    <span className="limit-label">Mensal:</span>
                    <span className="limit-value">R$ {limit.monthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Processing Times */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <Card className="withdraw-info-card">
          <CardHeader className="withdraw-info-header">
            <CardTitle className="withdraw-info-title">
              <Clock className="w-5 h-5 text-chronos-gold" />
              Tempo de Processamento
            </CardTitle>
          </CardHeader>

          <CardContent className="withdraw-info-content">
            <div className="processing-times-list">
              {processingTimes.map((time, index) => (
                <motion.div
                  key={time.method}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="processing-time-item"
                >
                  <div className="processing-time-header">
                    <h4 className="processing-time-method">{time.method}</h4>
                    <span className="processing-time-duration">{time.time}</span>
                  </div>
                  <p className="processing-time-description">{time.description}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Requirements */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <Card className="withdraw-info-card">
          <CardHeader className="withdraw-info-header">
            <CardTitle className="withdraw-info-title">
              <Shield className="w-5 h-5 text-chronos-gold" />
              Requisitos
            </CardTitle>
          </CardHeader>

          <CardContent className="withdraw-info-content">
            <div className="requirements-list">
              {requirements.map((requirement, index) => (
                <motion.div
                  key={requirement.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                  className="requirement-item"
                >
                  <div className="requirement-icon">
                    {requirement.status === 'required' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div className="requirement-content">
                    <h5 className="requirement-title">{requirement.title}</h5>
                    <p className="requirement-description">{requirement.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Important Notes */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <Card className="withdraw-warning-card">
          <CardHeader className="withdraw-warning-header">
            <CardTitle className="withdraw-warning-title">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Informações Importantes
            </CardTitle>
          </CardHeader>

          <CardContent className="withdraw-warning-content">
            <div className="warning-notes">
              <div className="warning-note">
                <div className="warning-note-icon">⚠️</div>
                <div className="warning-note-text">
                  <strong>Verificação de Identidade:</strong> Saques podem ser suspensos 
                  para verificação adicional de segurança.
                </div>
              </div>
              
              <div className="warning-note">
                <div className="warning-note-icon">🕒</div>
                <div className="warning-note-text">
                  <strong>Horário de Processamento:</strong> Saques solicitados após 18h 
                  ou em fins de semana podem ter processamento no próximo dia útil.
                </div>
              </div>
              
              <div className="warning-note">
                <div className="warning-note-icon">🔒</div>
                <div className="warning-note-text">
                  <strong>Segurança:</strong> Todos os saques são monitorados por nosso 
                  sistema de segurança para prevenir fraudes.
                </div>
              </div>
              
              <div className="warning-note">
                <div className="warning-note-icon">📧</div>
                <div className="warning-note-text">
                  <strong>Confirmação:</strong> Você receberá um email de confirmação 
                  para cada saque solicitado.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Support */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
      >
        <Card className="withdraw-support-card">
          <CardHeader className="withdraw-support-header">
            <CardTitle className="withdraw-support-title">
              <FileText className="w-5 h-5 text-chronos-gold" />
              Precisa de Ajuda?
            </CardTitle>
          </CardHeader>

          <CardContent className="withdraw-support-content">
            <div className="support-options">
              <div className="support-option">
                <h5>Central de Ajuda</h5>
                <p>Consulte nosso FAQ sobre saques</p>
              </div>
              
              <div className="support-option">
                <h5>Suporte por Email</h5>
                <p>suporte@chronosplatform.com</p>
              </div>
              
              <div className="support-option">
                <h5>Chat Online</h5>
                <p>Disponível 24/7 para emergências</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
