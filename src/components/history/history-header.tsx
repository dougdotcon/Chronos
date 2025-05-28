'use client'

import { motion } from 'framer-motion'
import { History, Download, Filter, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HistoryHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="history-header"
    >
      <div className="history-header-content">
        <div className="history-header-text">
          <h1 className="history-header-title">
            <History className="w-8 h-8 text-chronos-gold" />
            Histórico Completo
          </h1>
          <p className="history-header-subtitle">
            Acompanhe todas as suas atividades: sorteios, transações, prêmios e muito mais
          </p>
        </div>

        <div className="history-header-actions">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Período
          </Button>
          
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="history-quick-stats"
      >
        <div className="history-stat">
          <span className="history-stat-number">47</span>
          <span className="history-stat-label">Sorteios participados</span>
        </div>
        <div className="history-stat">
          <span className="history-stat-number">3</span>
          <span className="history-stat-label">Vitórias</span>
        </div>
        <div className="history-stat">
          <span className="history-stat-number">R$ 1.250</span>
          <span className="history-stat-label">Total em prêmios</span>
        </div>
        <div className="history-stat">
          <span className="history-stat-number">15</span>
          <span className="history-stat-label">Transações</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
