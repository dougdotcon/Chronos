'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Trophy,
  Users,
  Clock,
  DollarSign,
  Sparkles,
  Shield,
  Zap
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const metrics = [
  {
    icon: Trophy,
    label: 'Jackpot',
    value: '11.000',
    suffix: 'Chronos',
    color: 'text-chronos-gold'
  },
  {
    icon: DollarSign,
    label: 'Diária',
    value: '500',
    suffix: 'Chronos',
    color: 'text-green-400'
  },
  {
    icon: Users,
    label: 'Jogadores',
    value: '2.847',
    suffix: 'Online',
    color: 'text-blue-400'
  },
  {
    icon: Clock,
    label: 'Próximo',
    value: '05:23',
    suffix: 'Minutos',
    color: 'text-orange-400'
  }
]

const features = [
  {
    icon: Shield,
    title: 'Transparência Total',
    description: 'Sorteios com prova criptográfica e auditoria pública'
  },
  {
    icon: Zap,
    title: 'Tempo Real',
    description: 'Resultados instantâneos e chat ao vivo'
  },
  {
    icon: Sparkles,
    title: 'Múltiplos Formatos',
    description: 'Demo, Individual, X1 e Batalhas em Grupo'
  }
]

export function HeroSection() {
  return (
    <section className="hero">
      {/* Hero Background with Statues */}
      <div className="hero-background">
        <div className="hero-statue left-statue"></div>
        <div className="hero-statue right-statue"></div>
        <div className="particles-container"></div>
      </div>

      <div className="hero-container">
        <div className="hero-content">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-title"
          >
            <span className="hero-title-main">CHRONOS</span>
            <span className="hero-title-sub">PLATFORM</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="hero-description"
          >
            A plataforma de sorteios mais transparente e segura do Brasil.
            Participe de sorteios exclusivos com tecnologia blockchain e ganhe prêmios incríveis.
          </motion.p>

          {/* Metrics Cards */}
          <div className="hero-stats">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                className="stat-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <div className="stat-icon">
                  <metric.icon className={`${metric.color}`} />
                </div>
                <div className="stat-value">
                  {metric.value}
                </div>
                <div className="stat-label">
                  {metric.label}
                </div>
                <div className="text-xs text-chronos-gold font-medium mt-1">
                  {metric.suffix}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="hero-cta"
          >
            <Button asChild className="btn-hero-primary">
              <Link href="/auth/signup">
                <Trophy className="w-5 h-5" />
                Começar Agora
              </Link>
            </Button>

            <Button asChild variant="outline" className="btn-hero-secondary">
              <Link href="/demo">
                <Sparkles className="w-5 h-5" />
                Experimentar Demo
              </Link>
            </Button>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator">
        <i className="fas fa-chevron-down"></i>
      </div>
    </section>
  )
}
