'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Star, 
  Trophy, 
  Zap,
  Crown,
  Shield,
  Flame
} from 'lucide-react'

interface UserLevelProps {
  userId: string
}

// Mock user level data
const userLevelData = {
  currentLevel: 12,
  currentXP: 2450,
  nextLevelXP: 3000,
  totalXP: 15750,
  levelName: 'Apostador Experiente',
  levelIcon: Trophy,
  levelColor: 'text-purple-500',
  progressPercentage: 81.7,
  nextLevelName: 'Mestre dos Sorteios',
  xpToNextLevel: 550,
  recentXPGains: [
    { action: 'Vitória em sorteio', xp: 150, timestamp: new Date(Date.now() - 1000 * 60 * 30) },
    { action: 'Participação diária', xp: 25, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { action: 'Primeira vitória do dia', xp: 50, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6) }
  ]
}

const levelTiers = [
  { level: 1, name: 'Novato', icon: Star, color: 'text-gray-400', minXP: 0 },
  { level: 5, name: 'Iniciante', icon: Zap, color: 'text-blue-400', minXP: 500 },
  { level: 10, name: 'Apostador', icon: Trophy, color: 'text-purple-400', minXP: 2000 },
  { level: 15, name: 'Experiente', icon: Crown, color: 'text-yellow-400', minXP: 5000 },
  { level: 20, name: 'Mestre', icon: Shield, color: 'text-red-400', minXP: 10000 },
  { level: 25, name: 'Lenda', icon: Flame, color: 'text-orange-400', minXP: 20000 }
]

export function UserLevel({ userId }: UserLevelProps) {
  const currentTier = levelTiers.find(tier => 
    userLevelData.currentLevel >= tier.level && 
    (levelTiers[levelTiers.indexOf(tier) + 1]?.level > userLevelData.currentLevel || !levelTiers[levelTiers.indexOf(tier) + 1])
  ) || levelTiers[0]

  const LevelIcon = currentTier.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="user-level-card">
        <CardHeader className="user-level-header">
          <CardTitle className="user-level-title">
            <LevelIcon className={`w-5 h-5 ${currentTier.color}`} />
            Nível do Usuário
          </CardTitle>
        </CardHeader>

        <CardContent className="user-level-content">
          {/* Current Level Display */}
          <div className="user-level-current">
            <div className="user-level-badge">
              <LevelIcon className={`w-8 h-8 ${currentTier.color}`} />
              <div className="user-level-info">
                <span className="user-level-number">Nível {userLevelData.currentLevel}</span>
                <span className="user-level-name">{userLevelData.levelName}</span>
              </div>
            </div>

            <Badge className={`user-level-tier ${currentTier.color}`}>
              {currentTier.name}
            </Badge>
          </div>

          {/* XP Progress */}
          <div className="user-level-progress">
            <div className="user-level-progress-header">
              <span className="user-level-progress-label">
                Progresso para Nível {userLevelData.currentLevel + 1}
              </span>
              <span className="user-level-progress-xp">
                {userLevelData.currentXP} / {userLevelData.nextLevelXP} XP
              </span>
            </div>
            
            <Progress 
              value={userLevelData.progressPercentage} 
              className="user-level-progress-bar"
            />
            
            <div className="user-level-progress-footer">
              <span className="user-level-progress-remaining">
                {userLevelData.xpToNextLevel} XP para {userLevelData.nextLevelName}
              </span>
            </div>
          </div>

          {/* XP Breakdown */}
          <div className="user-level-stats">
            <div className="user-level-stat">
              <span className="user-level-stat-label">XP Total:</span>
              <span className="user-level-stat-value">{userLevelData.totalXP.toLocaleString()}</span>
            </div>
            <div className="user-level-stat">
              <span className="user-level-stat-label">Próximo Nível:</span>
              <span className="user-level-stat-value">{userLevelData.nextLevelName}</span>
            </div>
          </div>

          {/* Recent XP Gains */}
          <div className="user-level-recent">
            <h4 className="user-level-recent-title">XP Recente</h4>
            <div className="user-level-recent-list">
              {userLevelData.recentXPGains.map((gain, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="user-level-recent-item"
                >
                  <div className="user-level-recent-action">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>{gain.action}</span>
                  </div>
                  <div className="user-level-recent-xp">
                    +{gain.xp} XP
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Level Tiers Preview */}
          <div className="user-level-tiers">
            <h4 className="user-level-tiers-title">Níveis Disponíveis</h4>
            <div className="user-level-tiers-grid">
              {levelTiers.map((tier, index) => {
                const isUnlocked = userLevelData.currentLevel >= tier.level
                const isCurrent = currentTier.level === tier.level
                const TierIcon = tier.icon

                return (
                  <motion.div
                    key={tier.level}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`user-level-tier-item ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}`}
                  >
                    <TierIcon className={`w-5 h-5 ${isUnlocked ? tier.color : 'text-gray-500'}`} />
                    <div className="user-level-tier-info">
                      <span className="user-level-tier-name">{tier.name}</span>
                      <span className="user-level-tier-level">Nível {tier.level}+</span>
                    </div>
                    {isCurrent && (
                      <Badge variant="outline" className="user-level-tier-current">
                        Atual
                      </Badge>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
