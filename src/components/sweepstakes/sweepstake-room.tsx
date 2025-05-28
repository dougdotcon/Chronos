'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User } from 'next-auth'
import { SweepstakeHeader } from './sweepstake-room-header'
import { SweepstakeInfo } from './sweepstake-info'
import { ParticipantsList } from './participants-list'
import { SweepstakeChat } from './sweepstake-chat'
import { SweepstakeActions } from './sweepstake-actions'
import { SweepstakeTimer } from './sweepstake-timer'

interface SweepstakeRoomProps {
  sweepstakeId: string
  user: User
}

// Mock data - em produção viria da API
const mockSweepstake = {
  id: '1',
  title: 'Mega Sorteio Noturno',
  type: 'INDIVIDUAL',
  status: 'ACTIVE',
  participants: 15000,
  maxParticipants: 20000,
  prizePool: 25000,
  entryFee: 16.50,
  timeLeft: 5400, // 1h30m em segundos
  startTime: new Date(Date.now() + 1000 * 60 * 90),
  description: 'O maior sorteio da noite! Participe e concorra a prêmios incríveis com total transparência.',
  rules: [
    'Cada participante pode comprar apenas 1 entrada',
    'O sorteio acontece automaticamente quando atingir o número máximo de participantes ou quando o tempo esgotar',
    'O vencedor é escolhido através de algoritmo criptográfico verificável',
    'Prêmios são creditados automaticamente na conta do vencedor'
  ],
  isParticipating: false,
  canParticipate: true
}

export function SweepstakeRoom({ sweepstakeId, user }: SweepstakeRoomProps) {
  const [sweepstake, setSweepstake] = useState(mockSweepstake)
  const [isLoading, setIsLoading] = useState(false)

  // Simular atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setSweepstake(prev => ({
        ...prev,
        participants: prev.participants + Math.floor(Math.random() * 3),
        timeLeft: Math.max(0, prev.timeLeft - 1)
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleJoinSweepstake = async () => {
    setIsLoading(true)
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setSweepstake(prev => ({
      ...prev,
      isParticipating: true,
      participants: prev.participants + 1
    }))
    
    setIsLoading(false)
  }

  const handleLeaveSweepstake = async () => {
    setIsLoading(true)
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSweepstake(prev => ({
      ...prev,
      isParticipating: false,
      participants: Math.max(0, prev.participants - 1)
    }))
    
    setIsLoading(false)
  }

  return (
    <div className="sweepstake-room">
      <SweepstakeHeader sweepstake={sweepstake} />
      
      <div className="sweepstake-room-container">
        {/* Main Content */}
        <div className="sweepstake-room-main">
          {/* Timer Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="sweepstake-timer-section"
          >
            <SweepstakeTimer timeLeft={sweepstake.timeLeft} />
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="sweepstake-info-section"
          >
            <SweepstakeInfo sweepstake={sweepstake} />
          </motion.div>

          {/* Actions Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="sweepstake-actions-section"
          >
            <SweepstakeActions
              sweepstake={sweepstake}
              user={user}
              isLoading={isLoading}
              onJoin={handleJoinSweepstake}
              onLeave={handleLeaveSweepstake}
            />
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="sweepstake-room-sidebar">
          {/* Participants */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="sweepstake-participants-section"
          >
            <ParticipantsList 
              participants={sweepstake.participants}
              maxParticipants={sweepstake.maxParticipants}
            />
          </motion.div>

          {/* Chat */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="sweepstake-chat-section"
          >
            <SweepstakeChat sweepstakeId={sweepstakeId} user={user} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
