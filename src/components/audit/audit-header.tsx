'use client'

import { motion } from 'framer-motion'
import { Shield, Eye, CheckCircle, BarChart3 } from 'lucide-react'

const auditFeatures = [
  {
    icon: Shield,
    title: 'Algoritmo SHA-256',
    description: 'Criptografia militar',
    color: 'text-green-400'
  },
  {
    icon: Eye,
    title: 'Transparência Total',
    description: 'Todos os dados públicos',
    color: 'text-blue-400'
  },
  {
    icon: CheckCircle,
    title: 'Verificação Independente',
    description: 'Qualquer um pode auditar',
    color: 'text-yellow-400'
  },
  {
    icon: BarChart3,
    title: 'Estatísticas Reais',
    description: 'Dados em tempo real',
    color: 'text-purple-400'
  }
]

export function AuditHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="audit-header"
    >
      <div className="audit-header-content">
        <div className="audit-header-text">
          <h1 className="audit-header-title">
            Auditoria Pública
          </h1>
          <p className="audit-header-subtitle">
            Transparência total em todos os sorteios. Verifique você mesmo a integridade 
            dos nossos algoritmos e resultados.
          </p>
        </div>

        <div className="audit-header-features">
          {auditFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="audit-feature-card"
            >
              <div className={`audit-feature-icon ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <div className="audit-feature-content">
                <h3 className="audit-feature-title">
                  {feature.title}
                </h3>
                <p className="audit-feature-description">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="audit-header-cta">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="audit-verification-box"
          >
            <div className="audit-verification-icon">
              🔍
            </div>
            <div className="audit-verification-content">
              <h3>Verificação Independente</h3>
              <p>
                Todos os nossos sorteios podem ser verificados independentemente. 
                Use as ferramentas abaixo para auditar qualquer resultado.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
