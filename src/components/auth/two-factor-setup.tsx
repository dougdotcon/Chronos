'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  Smartphone, 
  QrCode, 
  Key, 
  CheckCircle, 
  AlertCircle,
  Copy,
  Download,
  RefreshCw
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

interface TwoFactorSetupProps {
  user: {
    id: string
    email: string
    twoFactorEnabled?: boolean
  }
}

export function TwoFactorSetup({ user }: TwoFactorSetupProps) {
  const [step, setStep] = useState<'setup' | 'verify' | 'backup' | 'complete'>('setup')
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const generateTwoFactor = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao configurar 2FA')
      }

      setQrCode(data.qrCode)
      setSecret(data.secret)
      setStep('verify')
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyTwoFactor = async () => {
    if (verificationCode.length !== 6) {
      setError('Código deve ter 6 dígitos')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id,
          code: verificationCode,
          secret
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Código inválido')
      }

      setBackupCodes(data.backupCodes)
      setStep('backup')
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const completeTwoFactor = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })

      if (!response.ok) {
        throw new Error('Erro ao ativar 2FA')
      }

      setStep('complete')
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const copySecret = () => {
    navigator.clipboard.writeText(secret)
    alert('Chave secreta copiada!')
  }

  const downloadBackupCodes = () => {
    const content = `Códigos de Backup - Chronos Platform
Email: ${user.email}
Data: ${new Date().toLocaleDateString('pt-BR')}

IMPORTANTE: Guarde estes códigos em local seguro!
Cada código pode ser usado apenas uma vez.

${backupCodes.map((code, index) => `${index + 1}. ${code}`).join('\n')}

ATENÇÃO:
- Use estes códigos apenas se não conseguir acessar seu app autenticador
- Cada código funciona apenas uma vez
- Gere novos códigos se necessário através das configurações`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chronos-backup-codes-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (step === 'setup') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="two-factor-setup-card">
          <CardHeader>
            <CardTitle className="two-factor-title">
              <Shield className="w-6 h-6 text-blue-500" />
              Configurar Autenticação de Dois Fatores
            </CardTitle>
            <p className="two-factor-description">
              Adicione uma camada extra de segurança à sua conta
            </p>
          </CardHeader>

          <CardContent>
            <div className="two-factor-benefits">
              <h4>Benefícios do 2FA:</h4>
              <ul className="two-factor-benefits-list">
                <li>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Proteção contra acesso não autorizado
                </li>
                <li>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Segurança adicional para transações
                </li>
                <li>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Códigos de backup para emergências
                </li>
                <li>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Compatível com Google Authenticator, Authy, etc.
                </li>
              </ul>
            </div>

            <div className="two-factor-requirements">
              <h4>Você precisará de:</h4>
              <div className="two-factor-requirement">
                <Smartphone className="w-5 h-5 text-blue-400" />
                <span>Um smartphone com app autenticador instalado</span>
              </div>
            </div>

            {error && (
              <Alert className="two-factor-error">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={generateTwoFactor}
              disabled={isLoading}
              className="two-factor-setup-button"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Configurando...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Configurar 2FA
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (step === 'verify') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="two-factor-verify-card">
          <CardHeader>
            <CardTitle className="two-factor-title">
              <QrCode className="w-6 h-6 text-blue-500" />
              Escaneie o QR Code
            </CardTitle>
            <p className="two-factor-description">
              Use seu app autenticador para escanear o código
            </p>
          </CardHeader>

          <CardContent>
            <div className="two-factor-qr-section">
              <div className="two-factor-qr-code">
                <QRCodeSVG
                  value={qrCode}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                />
              </div>

              <div className="two-factor-manual-setup">
                <h4>Configuração Manual:</h4>
                <p>Se não conseguir escanear, digite esta chave no seu app:</p>
                <div className="two-factor-secret">
                  <code>{secret}</code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copySecret}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="two-factor-verification">
              <h4>Digite o código do seu app:</h4>
              <div className="two-factor-code-input">
                <Input
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="two-factor-input"
                />
              </div>

              {error && (
                <Alert className="two-factor-error">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={verifyTwoFactor}
                disabled={isLoading || verificationCode.length !== 6}
                className="two-factor-verify-button"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verificar Código
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (step === 'backup') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="two-factor-backup-card">
          <CardHeader>
            <CardTitle className="two-factor-title">
              <Key className="w-6 h-6 text-yellow-500" />
              Códigos de Backup
            </CardTitle>
            <p className="two-factor-description">
              Guarde estes códigos em local seguro
            </p>
          </CardHeader>

          <CardContent>
            <Alert className="two-factor-backup-warning">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                <strong>IMPORTANTE:</strong> Estes códigos são sua única forma de acesso se perder seu telefone. 
                Cada código pode ser usado apenas uma vez.
              </AlertDescription>
            </Alert>

            <div className="two-factor-backup-codes">
              {backupCodes.map((code, index) => (
                <div key={index} className="two-factor-backup-code">
                  <span className="backup-code-number">{index + 1}.</span>
                  <code className="backup-code-value">{code}</code>
                </div>
              ))}
            </div>

            <div className="two-factor-backup-actions">
              <Button
                onClick={downloadBackupCodes}
                variant="outline"
                className="two-factor-download-button"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Códigos
              </Button>

              <Button
                onClick={completeTwoFactor}
                disabled={isLoading}
                className="two-factor-complete-button"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Ativando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Ativar 2FA
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Complete step
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="two-factor-complete-card">
        <CardHeader className="text-center">
          <div className="two-factor-success-icon">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          </div>
          <CardTitle className="two-factor-success-title">
            2FA Ativado com Sucesso!
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center">
          <div className="two-factor-success-content">
            <p className="two-factor-success-message">
              Sua conta agora está protegida com autenticação de dois fatores.
            </p>

            <div className="two-factor-success-info">
              <Badge className="two-factor-status-badge">
                <Shield className="w-3 h-3 mr-1" />
                2FA Ativo
              </Badge>
            </div>

            <div className="two-factor-next-steps">
              <h4>Próximos passos:</h4>
              <ul className="two-factor-steps-list">
                <li>✅ Guarde seus códigos de backup em local seguro</li>
                <li>✅ Teste o login com 2FA</li>
                <li>✅ Configure backup no seu app autenticador</li>
              </ul>
            </div>

            <Button
              onClick={() => window.location.reload()}
              className="two-factor-finish-button"
            >
              Concluir
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
