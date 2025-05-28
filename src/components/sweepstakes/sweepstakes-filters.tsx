'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  Zap, 
  Trophy, 
  Users, 
  Calendar,
  Play,
  X
} from 'lucide-react'

const filterCategories = [
  {
    id: 'all',
    label: 'Todos',
    icon: Filter,
    color: 'bg-gray-500/20 text-gray-300'
  },
  {
    id: 'quick',
    label: 'Rápidos',
    icon: Zap,
    color: 'bg-yellow-500/20 text-yellow-400'
  },
  {
    id: 'x1',
    label: 'Duelos X1',
    icon: Trophy,
    color: 'bg-orange-500/20 text-orange-400'
  },
  {
    id: 'group',
    label: 'Em Grupo',
    icon: Users,
    color: 'bg-blue-500/20 text-blue-400'
  },
  {
    id: 'demo',
    label: 'Demo',
    icon: Play,
    color: 'bg-green-500/20 text-green-400'
  },
  {
    id: 'monthly',
    label: 'Mensais',
    icon: Calendar,
    color: 'bg-purple-500/20 text-purple-400'
  }
]

const prizeRanges = [
  { id: 'low', label: 'R$ 1 - R$ 100', min: 1, max: 100 },
  { id: 'medium', label: 'R$ 100 - R$ 1.000', min: 100, max: 1000 },
  { id: 'high', label: 'R$ 1.000 - R$ 10.000', min: 1000, max: 10000 },
  { id: 'premium', label: 'R$ 10.000+', min: 10000, max: Infinity }
]

export function SweepstakesFilters() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activePrizeRange, setActivePrizeRange] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true)

  const clearFilters = () => {
    setActiveCategory('all')
    setActivePrizeRange(null)
    setSearchTerm('')
    setShowOnlyAvailable(true)
  }

  const hasActiveFilters = activeCategory !== 'all' || activePrizeRange || searchTerm || !showOnlyAvailable

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="sweepstakes-filters"
    >
      {/* Search Bar */}
      <div className="sweepstakes-search">
        <div className="sweepstakes-search-container">
          <Search className="sweepstakes-search-icon" />
          <Input
            placeholder="Buscar sorteios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sweepstakes-search-input"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="sweepstakes-search-clear"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div className="sweepstakes-categories">
        <h3 className="sweepstakes-filter-title">Modalidades</h3>
        <div className="sweepstakes-category-grid">
          {filterCategories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.id)}
              className={`sweepstakes-category-btn ${
                activeCategory === category.id ? 'active' : ''
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Prize Range Filters */}
      <div className="sweepstakes-prize-ranges">
        <h3 className="sweepstakes-filter-title">Faixa de Prêmio</h3>
        <div className="sweepstakes-prize-grid">
          {prizeRanges.map((range) => (
            <Badge
              key={range.id}
              variant={activePrizeRange === range.id ? 'default' : 'outline'}
              className={`sweepstakes-prize-badge ${
                activePrizeRange === range.id ? 'active' : ''
              }`}
              onClick={() => setActivePrizeRange(
                activePrizeRange === range.id ? null : range.id
              )}
            >
              {range.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Additional Filters */}
      <div className="sweepstakes-additional-filters">
        <label className="sweepstakes-checkbox-label">
          <input
            type="checkbox"
            checked={showOnlyAvailable}
            onChange={(e) => setShowOnlyAvailable(e.target.checked)}
            className="sweepstakes-checkbox"
          />
          <span>Apenas disponíveis</span>
        </label>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="sweepstakes-clear-filters"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="sweepstakes-clear-btn"
          >
            <X className="w-4 h-4 mr-2" />
            Limpar Filtros
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
