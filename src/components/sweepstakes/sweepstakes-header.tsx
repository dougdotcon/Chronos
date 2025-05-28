'use client'

import { motion } from 'framer-motion'
import { Trophy, Users, DollarSign, Clock } from 'lucide-react'

const stats = [
  {
    icon: Trophy,
    value: '1,247',
    label: 'Sorteios Ativos',
    color: 'text-yellow-400'
  },
  {
    icon: Users,
    value: '15,892',
    label: 'Jogadores Online',
    color: 'text-blue-400'
  },
  {
    icon: DollarSign,
    value: 'R$ 2.4M',
    label: 'Prêmios Distribuídos',
    color: 'text-green-400'
  },
  {
    icon: Clock,
    value: '24/7',
    label: 'Disponibilidade',
    color: 'text-purple-400'
  }
]

export function SweepstakesHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sweepstakes-header"
    >
      <div className="sweepstakes-header-content">
        <div className="sweepstakes-header-text">
          <h1 className="sweepstakes-header-title">
            Sorteios Chronos
          </h1>
          <p className="sweepstakes-header-subtitle">
            Participe dos sorteios mais transparentes e seguros do Brasil. 
            Escolha sua modalidade e concorra a prêmios incríveis!
          </p>
        </div>

        <div className="sweepstakes-header-stats">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="sweepstakes-stat-card"
            >
              <div className={`sweepstakes-stat-icon ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="sweepstakes-stat-content">
                <span className="sweepstakes-stat-value">
                  {stat.value}
                </span>
                <span className="sweepstakes-stat-label">
                  {stat.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
