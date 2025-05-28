'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Plus, Zap, Trophy, Users, Calendar } from 'lucide-react'

const quickCreateOptions = [
  {
    id: 'quick',
    title: 'Sorteio Rápido',
    description: 'Início imediato, 2-10 participantes',
    icon: Zap,
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    prize: 'R$ 50 - R$ 500'
  },
  {
    id: 'x1',
    title: 'Duelo X1',
    description: 'Apenas 2 participantes, winner takes all',
    icon: Trophy,
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    prize: 'R$ 20 - R$ 200'
  },
  {
    id: 'group',
    title: 'Batalha em Grupo',
    description: 'Equipes de 3-5 jogadores',
    icon: Users,
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    prize: 'R$ 100 - R$ 1.000'
  },
  {
    id: 'monthly',
    title: 'Evento Mensal',
    description: 'Grande prêmio, muitos participantes',
    icon: Calendar,
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    prize: 'R$ 1.000+'
  }
]

export function CreateSweepstakeButton() {
  const [showOptions, setShowOptions] = useState(false)

  const handleCreateSweepstake = (type: string) => {
    // TODO: Implementar criação de sorteio
    console.log('Criar sorteio do tipo:', type)
    setShowOptions(false)
  }

  return (
    <div className="create-sweepstake-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Button
          onClick={() => setShowOptions(!showOptions)}
          className="create-sweepstake-btn"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Criar Sorteio
        </Button>
      </motion.div>

      {/* Quick Create Options */}
      {showOptions && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="create-sweepstake-options"
        >
          <div className="create-sweepstake-options-header">
            <h3>Escolha o tipo de sorteio</h3>
            <p>Selecione uma modalidade para começar</p>
          </div>

          <div className="create-sweepstake-grid">
            {quickCreateOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`create-sweepstake-option ${option.color}`}
                onClick={() => handleCreateSweepstake(option.id)}
              >
                <div className="create-sweepstake-option-icon">
                  <option.icon className="w-6 h-6" />
                </div>
                
                <div className="create-sweepstake-option-content">
                  <h4 className="create-sweepstake-option-title">
                    {option.title}
                  </h4>
                  <p className="create-sweepstake-option-description">
                    {option.description}
                  </p>
                  <div className="create-sweepstake-option-prize">
                    Prêmio: {option.prize}
                  </div>
                </div>

                <div className="create-sweepstake-option-arrow">
                  <Plus className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="create-sweepstake-options-footer">
            <Button
              variant="outline"
              onClick={() => setShowOptions(false)}
              className="create-sweepstake-cancel"
            >
              Cancelar
            </Button>
            <Button
              variant="outline"
              className="create-sweepstake-custom"
            >
              Sorteio Personalizado
            </Button>
          </div>
        </motion.div>
      )}

      {/* Overlay */}
      {showOptions && (
        <div
          className="create-sweepstake-overlay"
          onClick={() => setShowOptions(false)}
        />
      )}
    </div>
  )
}
