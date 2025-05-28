'use client'

import { motion } from 'framer-motion'
import { Shield, Settings, Users, BarChart3, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export function AdminHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="admin-header"
    >
      <div className="admin-header-content">
        <div className="admin-header-main">
          <div className="admin-header-title">
            <Shield className="w-8 h-8 text-red-500" />
            <div>
              <h1>Painel Administrativo</h1>
              <p>Gestão completa da plataforma Chronos</p>
            </div>
          </div>
          
          <div className="admin-header-actions">
            <Badge variant="destructive" className="admin-access-badge">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Acesso Restrito
            </Badge>
            
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                Voltar ao Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="admin-quick-stats">
          <div className="admin-quick-stat">
            <Users className="w-5 h-5 text-blue-500" />
            <div>
              <span className="admin-stat-value">1,247</span>
              <span className="admin-stat-label">Usuários Ativos</span>
            </div>
          </div>
          
          <div className="admin-quick-stat">
            <BarChart3 className="w-5 h-5 text-green-500" />
            <div>
              <span className="admin-stat-value">R$ 45.230</span>
              <span className="admin-stat-label">Receita Hoje</span>
            </div>
          </div>
          
          <div className="admin-quick-stat">
            <Settings className="w-5 h-5 text-purple-500" />
            <div>
              <span className="admin-stat-value">23</span>
              <span className="admin-stat-label">Sorteios Ativos</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
