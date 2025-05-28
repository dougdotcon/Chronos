'use client'

import { motion } from 'framer-motion'
import { Swords, Users, Trophy, Clock, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function DuelsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="duels-header"
    >
      <div className="duels-header-content">
        <div className="duels-header-main">
          <div className="duels-header-title">
            <Swords className="w-8 h-8 text-red-500" />
            <div>
              <h1>Duelos X1</h1>
              <p>Desafie outros jogadores em batalhas diretas</p>
            </div>
          </div>

          <div className="duels-header-features">
            <Badge className="duels-feature-badge">
              <Zap className="w-3 h-3 mr-1" />
              Instantâneo
            </Badge>
            <Badge className="duels-feature-badge">
              <Users className="w-3 h-3 mr-1" />
              1v1
            </Badge>
            <Badge className="duels-feature-badge">
              <Trophy className="w-3 h-3 mr-1" />
              Winner Takes All
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="duels-quick-stats">
          <div className="duels-stat">
            <Swords className="w-6 h-6 text-red-500" />
            <div>
              <span className="duels-stat-value">23</span>
              <span className="duels-stat-label">Duelos Ativos</span>
            </div>
          </div>

          <div className="duels-stat">
            <Users className="w-6 h-6 text-blue-500" />
            <div>
              <span className="duels-stat-value">156</span>
              <span className="duels-stat-label">Jogadores Online</span>
            </div>
          </div>

          <div className="duels-stat">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <div>
              <span className="duels-stat-value">R$ 12.450</span>
              <span className="duels-stat-label">Em Disputa</span>
            </div>
          </div>

          <div className="duels-stat">
            <Clock className="w-6 h-6 text-purple-500" />
            <div>
              <span className="duels-stat-value">~30s</span>
              <span className="duels-stat-label">Tempo Médio</span>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="duels-how-it-works">
          <h3>Como Funciona:</h3>
          <div className="duels-steps">
            <div className="duels-step">
              <span className="duels-step-number">1</span>
              <span className="duels-step-text">Crie um duelo com o valor desejado</span>
            </div>
            <div className="duels-step">
              <span className="duels-step-number">2</span>
              <span className="duels-step-text">Aguarde outro jogador aceitar</span>
            </div>
            <div className="duels-step">
              <span className="duels-step-number">3</span>
              <span className="duels-step-text">O sorteio acontece automaticamente</span>
            </div>
            <div className="duels-step">
              <span className="duels-step-number">4</span>
              <span className="duels-step-text">O vencedor leva tudo!</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
