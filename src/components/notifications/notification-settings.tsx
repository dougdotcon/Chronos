'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Settings, 
  Bell, 
  Mail,
  Smartphone,
  Trophy,
  DollarSign,
  Users,
  Info
} from 'lucide-react'

interface NotificationSettingsProps {
  userId: string
}

interface NotificationPreferences {
  email: {
    prizes: boolean
    deposits: boolean
    sweepstakes: boolean
    system: boolean
  }
  push: {
    prizes: boolean
    deposits: boolean
    sweepstakes: boolean
    system: boolean
  }
  inApp: {
    prizes: boolean
    deposits: boolean
    sweepstakes: boolean
    system: boolean
  }
}

export function NotificationSettings({ userId }: NotificationSettingsProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: {
      prizes: true,
      deposits: true,
      sweepstakes: false,
      system: true
    },
    push: {
      prizes: true,
      deposits: false,
      sweepstakes: true,
      system: false
    },
    inApp: {
      prizes: true,
      deposits: true,
      sweepstakes: true,
      system: true
    }
  })

  const [isSaving, setIsSaving] = useState(false)

  const updatePreference = (
    channel: keyof NotificationPreferences,
    type: keyof NotificationPreferences['email'],
    value: boolean
  ) => {
    setPreferences(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [type]: value
      }
    }))
  }

  const savePreferences = async () => {
    setIsSaving(true)
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Preferências salvas:', preferences)
    } catch (error) {
      console.error('Erro ao salvar preferências:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const notificationTypes = [
    {
      key: 'prizes' as const,
      label: 'Prêmios e Vitórias',
      description: 'Quando você ganhar um sorteio',
      icon: Trophy,
      color: 'text-yellow-400'
    },
    {
      key: 'deposits' as const,
      label: 'Depósitos e Saques',
      description: 'Confirmações de transações financeiras',
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      key: 'sweepstakes' as const,
      label: 'Sorteios',
      description: 'Início, fim e atualizações de sorteios',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      key: 'system' as const,
      label: 'Sistema',
      description: 'Manutenções e atualizações importantes',
      icon: Info,
      color: 'text-orange-400'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="notification-settings"
    >
      {/* Settings Card */}
      <Card className="notification-settings-card">
        <CardHeader className="notification-settings-header">
          <CardTitle className="notification-settings-title">
            <Settings className="w-5 h-5 text-chronos-gold" />
            Configurações
          </CardTitle>
        </CardHeader>

        <CardContent className="notification-settings-content">
          <div className="notification-channels">
            <h4 className="notification-channels-title">
              Canais de Notificação
            </h4>

            {/* Channel Headers */}
            <div className="notification-channels-header">
              <div className="channel-type-label">Tipo</div>
              <div className="channel-header">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </div>
              <div className="channel-header">
                <Bell className="w-4 h-4" />
                <span>Push</span>
              </div>
              <div className="channel-header">
                <Smartphone className="w-4 h-4" />
                <span>App</span>
              </div>
            </div>

            {/* Notification Types */}
            <div className="notification-types">
              {notificationTypes.map((type, index) => (
                <motion.div
                  key={type.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="notification-type-row"
                >
                  <div className="notification-type-info">
                    <div className={`notification-type-icon ${type.color}`}>
                      <type.icon className="w-4 h-4" />
                    </div>
                    <div className="notification-type-text">
                      <h5 className="notification-type-label">
                        {type.label}
                      </h5>
                      <p className="notification-type-description">
                        {type.description}
                      </p>
                    </div>
                  </div>

                  <div className="notification-type-switches">
                    {/* Email */}
                    <div className="notification-switch">
                      <Switch
                        checked={preferences.email[type.key]}
                        onCheckedChange={(checked) => 
                          updatePreference('email', type.key, checked)
                        }
                      />
                    </div>

                    {/* Push */}
                    <div className="notification-switch">
                      <Switch
                        checked={preferences.push[type.key]}
                        onCheckedChange={(checked) => 
                          updatePreference('push', type.key, checked)
                        }
                      />
                    </div>

                    {/* In-App */}
                    <div className="notification-switch">
                      <Switch
                        checked={preferences.inApp[type.key]}
                        onCheckedChange={(checked) => 
                          updatePreference('inApp', type.key, checked)
                        }
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="notification-settings-actions">
            <Button 
              onClick={savePreferences}
              disabled={isSaving}
              className="save-preferences-btn"
            >
              {isSaving ? 'Salvando...' : 'Salvar Preferências'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Card className="notification-quick-actions-card">
          <CardHeader className="notification-quick-actions-header">
            <CardTitle className="notification-quick-actions-title">
              Ações Rápidas
            </CardTitle>
          </CardHeader>

          <CardContent className="notification-quick-actions-content">
            <div className="quick-actions-list">
              <Button 
                variant="outline" 
                size="sm" 
                className="quick-action-btn"
                onClick={() => {
                  setPreferences(prev => ({
                    email: { prizes: true, deposits: true, sweepstakes: true, system: true },
                    push: { prizes: true, deposits: true, sweepstakes: true, system: true },
                    inApp: { prizes: true, deposits: true, sweepstakes: true, system: true }
                  }))
                }}
              >
                Ativar Todas
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="quick-action-btn"
                onClick={() => {
                  setPreferences(prev => ({
                    email: { prizes: false, deposits: false, sweepstakes: false, system: false },
                    push: { prizes: false, deposits: false, sweepstakes: false, system: false },
                    inApp: { prizes: false, deposits: false, sweepstakes: false, system: false }
                  }))
                }}
              >
                Desativar Todas
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="quick-action-btn"
                onClick={() => {
                  setPreferences({
                    email: { prizes: true, deposits: true, sweepstakes: false, system: true },
                    push: { prizes: true, deposits: false, sweepstakes: true, system: false },
                    inApp: { prizes: true, deposits: true, sweepstakes: true, system: true }
                  })
                }}
              >
                Configuração Recomendada
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
