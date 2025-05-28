'use client'

import { motion } from 'framer-motion'
import { Settings, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function SettingsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="settings-header"
    >
      <div className="settings-header-content">
        <div className="settings-header-main">
          <Button variant="ghost" size="sm" asChild className="settings-back-btn">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
          
          <div className="settings-header-title">
            <Settings className="w-6 h-6 text-chronos-gold" />
            <h1>Configurações</h1>
          </div>
        </div>
        
        <p className="settings-header-description">
          Gerencie suas preferências e configurações da conta
        </p>
      </div>
    </motion.div>
  )
}
