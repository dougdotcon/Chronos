'use client'

import { motion } from 'framer-motion'
import { Trophy, Medal, Crown, Star, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function RankingsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rankings-header"
    >
      <div className="rankings-header-content">
        <div className="rankings-header-main">
          <div className="rankings-header-title">
            <Trophy className="w-8 h-8 text-chronos-gold" />
            <div>
              <h1>Rankings</h1>
              <p>Os melhores jogadores da plataforma Chronos</p>
            </div>
          </div>

          <div className="rankings-header-stats">
            <Badge className="rankings-period-badge">
              <TrendingUp className="w-3 h-3 mr-1" />
              Dezembro 2024
            </Badge>
          </div>
        </div>

        {/* Top 3 Preview */}
        <div className="rankings-podium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="podium-position second"
          >
            <div className="podium-medal">
              <Medal className="w-8 h-8 text-gray-400" />
              <span className="podium-number">2</span>
            </div>
            <div className="podium-info">
              <span className="podium-name">Maria Silva</span>
              <span className="podium-score">R$ 15.430</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="podium-position first"
          >
            <div className="podium-medal">
              <Crown className="w-10 h-10 text-yellow-400" />
              <span className="podium-number">1</span>
            </div>
            <div className="podium-info">
              <span className="podium-name">João Santos</span>
              <span className="podium-score">R$ 23.750</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="podium-position third"
          >
            <div className="podium-medal">
              <Medal className="w-8 h-8 text-orange-400" />
              <span className="podium-number">3</span>
            </div>
            <div className="podium-info">
              <span className="podium-name">Pedro Costa</span>
              <span className="podium-score">R$ 12.890</span>
            </div>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="rankings-quick-stats">
          <div className="rankings-stat">
            <Star className="w-5 h-5 text-yellow-400" />
            <div>
              <span className="rankings-stat-value">1,247</span>
              <span className="rankings-stat-label">Jogadores Ativos</span>
            </div>
          </div>
          
          <div className="rankings-stat">
            <Trophy className="w-5 h-5 text-purple-400" />
            <div>
              <span className="rankings-stat-value">R$ 125.430</span>
              <span className="rankings-stat-label">Total Distribuído</span>
            </div>
          </div>
          
          <div className="rankings-stat">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <div>
              <span className="rankings-stat-value">456</span>
              <span className="rankings-stat-label">Sorteios Realizados</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
