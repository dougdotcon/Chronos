'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Trophy, 
  Zap, 
  Users, 
  Calendar,
  Play,
  Gift
} from 'lucide-react'

const quickActions = [
  {
    title: 'Sorteio Rápido',
    description: 'Participe do próximo sorteio',
    icon: Zap,
    href: '/sweepstakes/quick',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10'
  },
  {
    title: 'Duelo X1',
    description: 'Desafie outro jogador',
    icon: Trophy,
    href: '/sweepstakes/x1',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10'
  },
  {
    title: 'Batalha em Grupo',
    description: 'Participe com amigos',
    icon: Users,
    href: '/sweepstakes/group',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10'
  },
  {
    title: 'Sorteio Demo',
    description: 'Teste grátis',
    icon: Play,
    href: '/sweepstakes/demo',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10'
  },
  {
    title: 'Batalha Mensal',
    description: 'Evento especial',
    icon: Calendar,
    href: '/sweepstakes/monthly',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10'
  },
  {
    title: 'Indicar Amigo',
    description: 'Ganhe bônus',
    icon: Gift,
    href: '/referral',
    color: 'text-pink-400',
    bgColor: 'bg-pink-400/10'
  }
]

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="quick-actions-card">
        <CardHeader className="quick-actions-header">
          <CardTitle className="quick-actions-title">
            Ações Rápidas
          </CardTitle>
        </CardHeader>

        <CardContent className="quick-actions-content">
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <Link href={action.href} className="quick-action-item">
                  <div className={`quick-action-icon ${action.bgColor}`}>
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <div className="quick-action-content">
                    <h3 className="quick-action-title">
                      {action.title}
                    </h3>
                    <p className="quick-action-description">
                      {action.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
