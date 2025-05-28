'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Mail, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

export function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'expired'>('verifying')
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    } else {
      setStatus('error')
      setError('Token de verificação não encontrado')
    }
  }, [token])

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verificationToken })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 410) {
          setStatus('expired')
        } else {
          setStatus('error')
          setError(data.error || 'Erro ao verificar email')
        }
        return
      }

      setStatus('success')
    } catch (error) {
      setStatus('error')
      setError('Erro de conexão. Tente novamente.')
    }
  }

  const resendVerificationEmail = async () => {
    if (!email || resendCooldown > 0) return

    setIsResending(true)
    setError('')

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao reenviar email')
      }

      setResendCooldown(60) // 60 seconds cooldown
      alert('Email de verificação reenviado com sucesso!')
    } catch (error) {
      setError(error.message)
    } finally {
      setIsResending(false)
    }
  }

  if (status === 'verifying') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="verify-email-card">
          <CardHeader className="text-center">
            <div className="verify-loading-icon">
              <RefreshCw className="w-16 h-16 text-chronos-gold mx-auto animate-spin" />
            </div>
            <CardTitle className="verify-title">
              Verificando Email...
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center">
            <p className="verify-message">
              Aguarde enquanto verificamos seu email.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="verify-success-card">
          <CardHeader className="text-center">
            <div className="verify-success-icon">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            </div>
            <CardTitle className="verify-success-title">
              Email Verificado!
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center">
            <div className="verify-success-content">
              <p className="verify-success-message">
                Seu email foi verificado com sucesso! Agora você pode acessar todas as funcionalidades da plataforma.
              </p>
              
              <div className="verify-success-benefits">
                <h4>Agora você pode:</h4>
                <ul className="verify-benefits-list">
                  <li>✅ Participar de sorteios</li>
                  <li>✅ Fazer depósitos e saques</li>
                  <li>✅ Receber notificações importantes</li>
                  <li>✅ Acessar o programa de afiliados</li>
                </ul>
              </div>
              
              <Button 
                onClick={() => router.push('/dashboard')}
                className="verify-success-button"
              >
                Acessar Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (status === 'expired') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="verify-expired-card">
          <CardHeader className="text-center">
            <div className="verify-expired-icon">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto" />
            </div>
            <CardTitle className="verify-expired-title">
              Link Expirado
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center">
            <div className="verify-expired-content">
              <p className="verify-expired-message">
                O link de verificação expirou. Links de verificação são válidos por 24 horas por motivos de segurança.
              </p>
              
              {email && (
                <div className="verify-resend-section">
                  <p className="verify-resend-text">
                    Podemos enviar um novo link de verificação para <strong>{email}</strong>
                  </p>
                  
                  <Button
                    onClick={resendVerificationEmail}
                    disabled={isResending || resendCooldown > 0}
                    className="verify-resend-button"
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : resendCooldown > 0 ? (
                      `Aguarde ${resendCooldown}s`
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Reenviar Email
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              <div className="verify-expired-actions">
                <Link href="/auth/signin" className="verify-back-link">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Error state
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="verify-error-card">
        <CardHeader className="text-center">
          <div className="verify-error-icon">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          </div>
          <CardTitle className="verify-error-title">
            Erro na Verificação
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center">
          <div className="verify-error-content">
            {error && (
              <Alert className="verify-error-alert">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <p className="verify-error-message">
              Não foi possível verificar seu email. Isso pode acontecer se:
            </p>
            
            <ul className="verify-error-reasons">
              <li>O link já foi usado anteriormente</li>
              <li>O link está malformado ou inválido</li>
              <li>Houve um erro temporário no servidor</li>
            </ul>
            
            {email && (
              <div className="verify-resend-section">
                <p className="verify-resend-text">
                  Tentar reenviar email de verificação para <strong>{email}</strong>?
                </p>
                
                <Button
                  onClick={resendVerificationEmail}
                  disabled={isResending || resendCooldown > 0}
                  variant="outline"
                  className="verify-resend-button"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : resendCooldown > 0 ? (
                    `Aguarde ${resendCooldown}s`
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Reenviar Email
                    </>
                  )}
                </Button>
              </div>
            )}
            
            <div className="verify-error-actions">
              <Link href="/auth/signin" className="verify-back-link">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Login
              </Link>
              
              <Link href="/support" className="verify-support-link">
                Precisa de Ajuda?
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
