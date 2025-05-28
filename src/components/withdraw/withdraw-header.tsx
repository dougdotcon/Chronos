'use client'

import { motion } from 'framer-motion'
import { ArrowDownToLine, Shield, Clock, CheckCircle } from 'lucide-react'

const withdrawFeatures = [
  {
    icon: Shield,
    title: 'Seguro',
    description: 'Transações protegidas',
    color: 'text-green-400'
  },
  {
    icon: Clock,
    title: 'Rápido',
    description: 'Processamento em até 24h',
    color: 'text-blue-400'
  },
  {
    icon: CheckCircle,
    title: 'Confiável',
    description: 'Sistema verificado',
    color: 'text-purple-400'
  }
]

export function WithdrawHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="withdraw-header"
    >
      <div className="withdraw-header-content">
        <div className="withdraw-header-text">
          <h1 className="withdraw-header-title">
            <ArrowDownToLine className="w-8 h-8 text-chronos-gold" />
            Sacar Fundos
          </h1>
          <p className="withdraw-header-subtitle">
            Retire seus ganhos de forma segura e rápida. Processamento em até 24 horas úteis.
          </p>
        </div>

        <div className="withdraw-header-features">
          {withdrawFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="withdraw-feature-card"
            >
              <div className={`withdraw-feature-icon ${feature.color}`}>
                <feature.icon className="w-5 h-5" />
              </div>
              <div className="withdraw-feature-content">
                <h3 className="withdraw-feature-title">
                  {feature.title}
                </h3>
                <p className="withdraw-feature-description">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="withdraw-header-warning">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="withdraw-warning-box"
          >
            <div className="withdraw-warning-icon">
              ⚠️
            </div>
            <div className="withdraw-warning-content">
              <h3>Importante</h3>
              <p>
                Saques estão sujeitos a verificação de identidade. Certifique-se de que 
                seus dados estão atualizados para evitar atrasos no processamento.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
