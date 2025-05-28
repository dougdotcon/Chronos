'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Lock,
  Key,
  Smartphone,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react'

interface ProfileSecurityProps {
  userId: string
}

export function ProfileSecurity({ userId }: ProfileSecurityProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true,
    sessionTimeout: '30'
  })

  // Mock security data
  const securityInfo = {
    lastPasswordChange: new Date('2024-01-15'),
    activeSessions: 2,
    recentLogins: [
      { device: 'Chrome/Windows', location: 'São Paulo, SP', time: new Date(Date.now() - 1000 * 60 * 30) },
      { device: 'Safari/iPhone', location: 'São Paulo, SP', time: new Date(Date.now() - 1000 * 60 * 60 * 6) }
    ],
    verificationLevel: 'basic'
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.new !== passwordData.confirm) {
      alert('As senhas não coincidem')
      return
    }

    if (passwordData.new.length < 8) {
      alert('A senha deve ter pelo menos 8 caracteres')
      return
    }

    setIsChangingPassword(true)
    try {
      // Simular mudança de senha
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Senha alterada')
      alert('Senha alterada com sucesso!')
      
      setPasswordData({ current: '', new: '', confirm: '' })
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      alert('Erro ao alterar senha. Tente novamente.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleSecuritySettingChange = (setting: string, value: boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const getVerificationBadge = (level: string) => {
    switch (level) {
      case 'basic':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Básica
          </Badge>
        )
      case 'verified':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verificada
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Card className="profile-security-card">
        <CardHeader className="profile-security-header">
          <CardTitle className="profile-security-title">
            <Shield className="w-5 h-5 text-chronos-gold" />
            Segurança da Conta
          </CardTitle>
        </CardHeader>

        <CardContent className="profile-security-content">
          {/* Security Overview */}
          <div className="security-overview">
            <div className="security-status">
              <h4>Status de Verificação</h4>
              {getVerificationBadge(securityInfo.verificationLevel)}
            </div>
            
            <div className="security-stats">
              <div className="security-stat">
                <span className="security-stat-value">{securityInfo.activeSessions}</span>
                <span className="security-stat-label">Sessões Ativas</span>
              </div>
              <div className="security-stat">
                <span className="security-stat-value">
                  {Math.floor((Date.now() - securityInfo.lastPasswordChange.getTime()) / (1000 * 60 * 60 * 24))}d
                </span>
                <span className="security-stat-label">Última Alteração</span>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="security-section">
            <h4 className="security-section-title">
              <Lock className="w-4 h-4" />
              Alterar Senha
            </h4>
            
            <form onSubmit={handlePasswordChange} className="password-form">
              <div className="form-group">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <div className="password-input-container">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.current}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                    placeholder="Digite sua senha atual"
                    className="password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="password-toggle"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <div className="password-input-container">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.new}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                      placeholder="Digite a nova senha"
                      className="password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="password-toggle"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <div className="password-input-container">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                      placeholder="Confirme a nova senha"
                      className="password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="password-toggle"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!passwordData.current || !passwordData.new || !passwordData.confirm || isChangingPassword}
                className="password-submit-btn"
              >
                {isChangingPassword ? (
                  <>
                    <div className="loading-spinner" />
                    Alterando...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    Alterar Senha
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Two-Factor Authentication */}
          <div className="security-section">
            <h4 className="security-section-title">
              <Smartphone className="w-4 h-4" />
              Autenticação de Dois Fatores
            </h4>
            
            <div className="two-factor-setting">
              <div className="two-factor-info">
                <h5>Ativar 2FA</h5>
                <p>Adicione uma camada extra de segurança à sua conta</p>
              </div>
              <Switch
                checked={securitySettings.twoFactorEnabled}
                onCheckedChange={(checked) => handleSecuritySettingChange('twoFactorEnabled', checked)}
              />
            </div>

            {securitySettings.twoFactorEnabled && (
              <div className="two-factor-setup">
                <p className="two-factor-instructions">
                  Configure seu aplicativo autenticador escaneando o QR code ou inserindo a chave manualmente.
                </p>
                <Button variant="outline" size="sm">
                  Configurar Aplicativo
                </Button>
              </div>
            )}
          </div>

          {/* Security Settings */}
          <div className="security-section">
            <h4 className="security-section-title">
              <Shield className="w-4 h-4" />
              Configurações de Segurança
            </h4>
            
            <div className="security-settings">
              <div className="security-setting">
                <div className="security-setting-info">
                  <h5>Alertas de Login</h5>
                  <p>Receba notificações sobre novos logins</p>
                </div>
                <Switch
                  checked={securitySettings.loginAlerts}
                  onCheckedChange={(checked) => handleSecuritySettingChange('loginAlerts', checked)}
                />
              </div>

              <div className="security-setting">
                <div className="security-setting-info">
                  <h5>Notificações por Email</h5>
                  <p>Alertas de segurança por email</p>
                </div>
                <Switch
                  checked={securitySettings.emailNotifications}
                  onCheckedChange={(checked) => handleSecuritySettingChange('emailNotifications', checked)}
                />
              </div>

              <div className="security-setting">
                <div className="security-setting-info">
                  <h5>Notificações por SMS</h5>
                  <p>Alertas de segurança por SMS</p>
                </div>
                <Switch
                  checked={securitySettings.smsNotifications}
                  onCheckedChange={(checked) => handleSecuritySettingChange('smsNotifications', checked)}
                />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="security-section">
            <h4 className="security-section-title">
              <Clock className="w-4 h-4" />
              Atividade Recente
            </h4>
            
            <div className="recent-activity">
              {securityInfo.recentLogins.map((login, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-info">
                    <span className="activity-device">{login.device}</span>
                    <span className="activity-location">{login.location}</span>
                  </div>
                  <span className="activity-time">
                    {login.time.toLocaleString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" className="view-all-activity">
              Ver Toda Atividade
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
