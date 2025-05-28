'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { 
  TrendingUp, 
  Users, 
  Trophy, 
  DollarSign,
  Shield,
  Clock,
  Target,
  Zap
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const stats = [
  {
    icon: DollarSign,
    label: 'Total Distribuído',
    value: 'R$ 2.847.392',
    change: '+12.5%',
    changeType: 'positive' as const,
    description: 'Em prêmios pagos este mês'
  },
  {
    icon: Users,
    label: 'Usuários Ativos',
    value: '12.847',
    change: '+8.2%',
    changeType: 'positive' as const,
    description: 'Jogadores únicos esta semana'
  },
  {
    icon: Trophy,
    label: 'Sorteios Realizados',
    value: '45.231',
    change: '+15.7%',
    changeType: 'positive' as const,
    description: 'Total de sorteios concluídos'
  },
  {
    icon: Target,
    label: 'Taxa de Sucesso',
    value: '99.97%',
    change: '+0.1%',
    changeType: 'positive' as const,
    description: 'Sorteios sem problemas técnicos'
  }
]

const features = [
  {
    icon: Shield,
    title: 'Segurança Máxima',
    description: 'Criptografia SHA-256 e auditoria pública de todos os sorteios',
    color: 'text-green-400'
  },
  {
    icon: Zap,
    title: 'Resultados Instantâneos',
    description: 'Sorteios processados em tempo real com Socket.IO',
    color: 'text-yellow-400'
  },
  {
    icon: Clock,
    title: 'Disponível 24/7',
    description: 'Plataforma online 24 horas por dia, 7 dias por semana',
    color: 'text-blue-400'
  },
  {
    icon: Users,
    title: 'Comunidade Ativa',
    description: 'Chat ao vivo e interação entre participantes',
    color: 'text-purple-400'
  }
]

function StatCard({ stat, index }: { stat: typeof stats[0], index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="chronos-card hover:border-chronos-gold/50 transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-chronos-gold/10 group-hover:bg-chronos-gold/20 transition-colors">
              <stat.icon className="h-6 w-6 text-chronos-gold" />
            </div>
            <div className={`flex items-center text-sm font-medium ${
              stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
            }`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              {stat.change}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-chronos-ivory group-hover:text-chronos-gold transition-colors">
              {stat.value}
            </h3>
            <p className="text-sm font-medium text-chronos-ivory/80">
              {stat.label}
            </p>
            <p className="text-xs text-chronos-ivory/60">
              {stat.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function FeatureCard({ feature, index }: { feature: typeof features[0], index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="flex items-start space-x-4 group"
    >
      <div className="flex-shrink-0 p-3 rounded-lg bg-chronos-charcoal/50 group-hover:bg-chronos-charcoal/70 transition-colors">
        <feature.icon className={`h-6 w-6 ${feature.color}`} />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-chronos-ivory group-hover:text-chronos-gold transition-colors">
          {feature.title}
        </h3>
        <p className="text-sm text-chronos-ivory/70">
          {feature.description}
        </p>
      </div>
    </motion.div>
  )
}

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-chronos-ivory/5 to-chronos-charcoal">
      <div className="container mx-auto px-4">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold chronos-text-gradient">
            Números que Impressionam
          </h2>
          <p className="text-lg text-chronos-ivory/70 max-w-2xl mx-auto">
            Transparência total com dados em tempo real da nossa plataforma
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>

        {/* Features Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-3xl font-display font-bold chronos-text-gradient">
                Por que Escolher o Chronos?
              </h3>
              <p className="text-lg text-chronos-ivory/70">
                Nossa plataforma oferece a melhor experiência em sorteios online 
                com tecnologia de ponta e transparência total.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <FeatureCard key={feature.title} feature={feature} index={index} />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Decorative chart/graph visualization */}
            <div className="relative h-96 bg-gradient-to-br from-chronos-maroon/20 to-chronos-violet/20 rounded-2xl p-8 overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="border border-chronos-gold/20" />
                  ))}
                </div>
              </div>

              {/* Chart bars */}
              <div className="relative z-10 flex items-end justify-center space-x-4 h-full">
                {[65, 80, 45, 90, 75, 95, 70, 85].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="w-8 bg-gradient-to-t from-chronos-gold to-chronos-bronze rounded-t-lg"
                  />
                ))}
              </div>

              {/* Floating elements */}
              <div className="absolute top-4 right-4 p-3 bg-chronos-gold/20 rounded-lg backdrop-blur-sm">
                <TrendingUp className="h-6 w-6 text-chronos-gold" />
              </div>
              
              <div className="absolute bottom-4 left-4 p-3 bg-chronos-violet/20 rounded-lg backdrop-blur-sm">
                <Shield className="h-6 w-6 text-chronos-violet" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center space-x-8 p-6 bg-chronos-charcoal/30 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center space-x-2 text-chronos-ivory/60">
              <Shield className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium">SSL Seguro</span>
            </div>
            <div className="flex items-center space-x-2 text-chronos-ivory/60">
              <Target className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-medium">Auditado</span>
            </div>
            <div className="flex items-center space-x-2 text-chronos-ivory/60">
              <Clock className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-medium">24/7 Online</span>
            </div>
            <div className="flex items-center space-x-2 text-chronos-ivory/60">
              <Users className="h-5 w-5 text-purple-400" />
              <span className="text-sm font-medium">+10K Usuários</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
