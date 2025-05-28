'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Trophy, 
  Users, 
  DollarSign, 
  Shield,
  CheckCircle,
  BarChart3
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Mock data - em produção viria da API
const auditStats = {
  totalSweepstakes: 15847,
  totalParticipants: 89234,
  totalPrizesPaid: 2847392.50,
  verificationRate: 99.97,
  averageParticipants: 12.4,
  transparencyScore: 100
}

const statCards = [
  {
    title: 'Sorteios Realizados',
    value: auditStats.totalSweepstakes.toLocaleString(),
    icon: Trophy,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    description: 'Total de sorteios executados'
  },
  {
    title: 'Participantes Únicos',
    value: auditStats.totalParticipants.toLocaleString(),
    icon: Users,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    description: 'Usuários que participaram'
  },
  {
    title: 'Prêmios Distribuídos',
    value: formatCurrency(auditStats.totalPrizesPaid),
    icon: DollarSign,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    description: 'Total pago em prêmios'
  },
  {
    title: 'Taxa de Verificação',
    value: `${auditStats.verificationRate}%`,
    icon: CheckCircle,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    description: 'Sorteios verificados com sucesso'
  },
  {
    title: 'Média de Participantes',
    value: auditStats.averageParticipants.toString(),
    icon: BarChart3,
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    description: 'Por sorteio realizado'
  },
  {
    title: 'Score de Transparência',
    value: `${auditStats.transparencyScore}%`,
    icon: Shield,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    description: 'Índice de transparência'
  }
]

export function AuditStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="audit-stats"
    >
      <div className="audit-stats-grid">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          >
            <Card className={`audit-stat-card ${stat.bgColor}`}>
              <CardContent className="audit-stat-content">
                <div className="audit-stat-header">
                  <div className={`audit-stat-icon ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="audit-stat-info">
                    <h3 className="audit-stat-value">
                      {stat.value}
                    </h3>
                    <p className="audit-stat-title">
                      {stat.title}
                    </p>
                  </div>
                </div>
                <p className="audit-stat-description">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="audit-additional-info"
      >
        <Card className="audit-info-card">
          <CardContent className="audit-info-content">
            <div className="audit-info-header">
              <Shield className="w-6 h-6 text-chronos-gold" />
              <h3>Compromisso com a Transparência</h3>
            </div>
            <div className="audit-info-text">
              <p>
                Todos os nossos sorteios utilizam algoritmos criptográficos verificáveis 
                baseados em SHA-256. Cada resultado pode ser auditado independentemente 
                usando as ferramentas públicas disponíveis nesta página.
              </p>
              <div className="audit-info-highlights">
                <div className="audit-info-highlight">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Código fonte aberto para verificação</span>
                </div>
                <div className="audit-info-highlight">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Resultados imutáveis e rastreáveis</span>
                </div>
                <div className="audit-info-highlight">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Auditoria independente disponível 24/7</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
