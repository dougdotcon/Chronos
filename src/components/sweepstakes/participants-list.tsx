'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Crown, 
  Clock,
  TrendingUp
} from 'lucide-react'
import { getInitials, formatRelativeTime } from '@/lib/utils'

interface ParticipantsListProps {
  participants: number
  maxParticipants: number
}

// Mock data - em produção viria da API
const mockParticipants = [
  {
    id: '1',
    user: {
      id: 'user1',
      name: 'João Silva',
      image: null
    },
    joinedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    isCreator: true
  },
  {
    id: '2',
    user: {
      id: 'user2',
      name: 'Maria Santos',
      image: null
    },
    joinedAt: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
    isCreator: false
  },
  {
    id: '3',
    user: {
      id: 'user3',
      name: 'Pedro Costa',
      image: null
    },
    joinedAt: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
    isCreator: false
  },
  {
    id: '4',
    user: {
      id: 'user4',
      name: 'Ana Oliveira',
      image: null
    },
    joinedAt: new Date(Date.now() - 1000 * 60 * 2), // 2 min ago
    isCreator: false
  }
]

export function ParticipantsList({ participants, maxParticipants }: ParticipantsListProps) {
  const fillPercentage = (participants / maxParticipants) * 100
  const remainingSlots = maxParticipants - participants

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="participants-card">
        <CardHeader className="participants-header">
          <CardTitle className="participants-title">
            <Users className="w-5 h-5 text-chronos-gold" />
            Participantes
          </CardTitle>
          <div className="participants-stats">
            <span className="participants-count">
              {participants}/{maxParticipants}
            </span>
            <Badge 
              variant={remainingSlots <= 5 ? 'destructive' : 'outline'}
              className="participants-remaining"
            >
              {remainingSlots} vagas
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="participants-content">
          {/* Progress Bar */}
          <div className="participants-progress">
            <div className="participants-progress-bar">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${fillPercentage}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="participants-progress-fill"
              />
            </div>
            <span className="participants-progress-text">
              {Math.round(fillPercentage)}% preenchido
            </span>
          </div>

          {/* Participants List */}
          <div className="participants-list">
            <h4 className="participants-list-title">
              Participantes Confirmados
            </h4>
            
            <div className="participants-items">
              {mockParticipants.slice(0, participants).map((participant, index) => (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="participant-item"
                >
                  <div className="participant-avatar-container">
                    <Avatar className="participant-avatar">
                      <AvatarImage src={participant.user.image || ''} />
                      <AvatarFallback className="participant-avatar-fallback">
                        {getInitials(participant.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    {participant.isCreator && (
                      <div className="participant-creator-badge">
                        <Crown className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div className="participant-info">
                    <div className="participant-name">
                      {participant.user.name}
                      {participant.isCreator && (
                        <Badge variant="outline" className="participant-creator-text">
                          Criador
                        </Badge>
                      )}
                    </div>
                    <div className="participant-joined">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(participant.joinedAt)}
                    </div>
                  </div>

                  <div className="participant-position">
                    #{index + 1}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty Slots */}
            {remainingSlots > 0 && (
              <div className="participants-empty-slots">
                <h5 className="empty-slots-title">
                  Vagas Disponíveis ({remainingSlots})
                </h5>
                <div className="empty-slots-grid">
                  {Array.from({ length: Math.min(remainingSlots, 6) }).map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                      className="empty-slot"
                    >
                      <div className="empty-slot-avatar">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="empty-slot-text">
                        Vaga #{participants + index + 1}
                      </span>
                    </motion.div>
                  ))}
                  {remainingSlots > 6 && (
                    <div className="empty-slot-more">
                      +{remainingSlots - 6} vagas
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Full Message */}
            {remainingSlots === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="participants-full-message"
              >
                <TrendingUp className="w-5 h-5 text-green-400" />
                <div>
                  <h4>Sorteio Lotado!</h4>
                  <p>Todas as vagas foram preenchidas</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Join Encouragement */}
          {remainingSlots > 0 && remainingSlots <= 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="participants-encouragement"
            >
              <div className="encouragement-icon">
                🔥
              </div>
              <div className="encouragement-text">
                <strong>Últimas vagas!</strong>
                <br />
                Apenas {remainingSlots} {remainingSlots === 1 ? 'vaga restante' : 'vagas restantes'}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
