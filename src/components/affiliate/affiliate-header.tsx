'use client'

import { motion } from 'framer-motion'
import { User } from 'next-auth'
import { 
  Users, 
  DollarSign, 
  TrendingUp,
  Share2,
  Gift,
  Star
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

interface AffiliateHeaderProps {
  user: User
}

// Mock affiliate data
const affiliateData = {
  totalReferrals: 47,
  activeReferrals: 32,
  totalCommissions: 2847.50,
  monthlyCommissions: 485.30,
  commissionRate: 15,
  tier: 'Gold',
  nextTier: 'Platinum',
  referralsToNextTier: 3
}

export function AffiliateHeader({ user }: AffiliateHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="affiliate-header"
    >
      <div className="affiliate-header-content">
        <div className="affiliate-header-main">
          <div className="affiliate-header-title">
            <Share2 className="w-8 h-8 text-chronos-gold" />
            <div>
              <h1>Programa de Afiliados</h1>
              <p>Ganhe dinheiro indicando amigos para o Chronos</p>
            </div>
          </div>

          <div className="affiliate-header-tier">
            <Badge className="affiliate-tier-badge">
              <Star className="w-3 h-3 mr-1" />
              Afiliado {affiliateData.tier}
            </Badge>
            <span className="affiliate-tier-rate">
              {affiliateData.commissionRate}% de comissão
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="affiliate-quick-stats">
          <div className="affiliate-quick-stat">
            <Users className="w-6 h-6 text-blue-500" />
            <div>
              <span className="affiliate-stat-value">{affiliateData.totalReferrals}</span>
              <span className="affiliate-stat-label">Indicações</span>
            </div>
          </div>

          <div className="affiliate-quick-stat">
            <DollarSign className="w-6 h-6 text-green-500" />
            <div>
              <span className="affiliate-stat-value">{formatCurrency(affiliateData.totalCommissions)}</span>
              <span className="affiliate-stat-label">Total Ganho</span>
            </div>
          </div>

          <div className="affiliate-quick-stat">
            <TrendingUp className="w-6 h-6 text-purple-500" />
            <div>
              <span className="affiliate-stat-value">{formatCurrency(affiliateData.monthlyCommissions)}</span>
              <span className="affiliate-stat-label">Este Mês</span>
            </div>
          </div>

          <div className="affiliate-quick-stat">
            <Gift className="w-6 h-6 text-orange-500" />
            <div>
              <span className="affiliate-stat-value">{affiliateData.activeReferrals}</span>
              <span className="affiliate-stat-label">Ativos</span>
            </div>
          </div>
        </div>

        {/* Next Tier Progress */}
        <div className="affiliate-tier-progress">
          <div className="affiliate-tier-info">
            <span className="affiliate-tier-current">Nível {affiliateData.tier}</span>
            <span className="affiliate-tier-arrow">→</span>
            <span className="affiliate-tier-next">Nível {affiliateData.nextTier}</span>
          </div>
          <div className="affiliate-tier-requirement">
            <span>Faltam {affiliateData.referralsToNextTier} indicações para o próximo nível</span>
          </div>
        </div>

        {/* Call to Action */}
        <div className="affiliate-header-cta">
          <Button size="lg" className="affiliate-share-btn">
            <Share2 className="w-5 h-5 mr-2" />
            Compartilhar Link
          </Button>
          <Button variant="outline" size="lg">
            Ver Materiais
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
