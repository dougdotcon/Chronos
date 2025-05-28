'use client'

import { motion } from 'framer-motion'
import { Play, Gift, Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export function DemoHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="demo-header"
    >
      <div className="demo-header-content">
        <div className="demo-header-main">
          <Badge className="demo-free-badge">
            <Gift className="w-3 h-3 mr-1" />
            100% Gratuito
          </Badge>
          
          <h1 className="demo-header-title">
            Experimente o Chronos
            <span className="demo-header-highlight">Gratuitamente</span>
          </h1>
          
          <p className="demo-header-description">
            Teste nossa plataforma sem compromisso. Participe de sorteios demo 
            e descubra como funciona o sistema mais transparente do Brasil.
          </p>

          <div className="demo-header-features">
            <div className="demo-feature">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>Sem cadastro necessário</span>
            </div>
            <div className="demo-feature">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>Prêmios virtuais</span>
            </div>
            <div className="demo-feature">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>Experiência completa</span>
            </div>
          </div>

          <div className="demo-header-actions">
            <Button size="lg" className="demo-start-btn">
              <Play className="w-5 h-5 mr-2" />
              Começar Demo
            </Button>
            
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/signup">
                Criar Conta Real
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="demo-header-visual">
          <div className="demo-preview-card">
            <div className="demo-preview-header">
              <div className="demo-preview-dots">
                <div className="demo-dot" />
                <div className="demo-dot" />
                <div className="demo-dot" />
              </div>
              <span className="demo-preview-title">Sorteio Demo</span>
            </div>
            
            <div className="demo-preview-content">
              <div className="demo-preview-prize">
                <span className="demo-preview-amount">R$ 1.000</span>
                <span className="demo-preview-label">Prêmio Virtual</span>
              </div>
              
              <div className="demo-preview-participants">
                <div className="demo-participant-avatars">
                  <div className="demo-avatar">👤</div>
                  <div className="demo-avatar">👤</div>
                  <div className="demo-avatar">👤</div>
                  <div className="demo-avatar-more">+5</div>
                </div>
                <span className="demo-participants-text">8 participantes</span>
              </div>
              
              <div className="demo-preview-timer">
                <span className="demo-timer-text">Sorteio em:</span>
                <span className="demo-timer-value">02:45</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
